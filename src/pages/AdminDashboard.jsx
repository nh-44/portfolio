import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  Settings,
  FileText,
  Code,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  LogOut,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Lock,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  Eye,
  ShieldCheck,
  Cpu,
  Award
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AdminDashboard({ onSettingsUpdated, onResumeUpdated }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab State: 'settings' | 'resume' | 'projects' | 'journey' | 'blog' | 'media'
  const [activeTab, setActiveTab] = useState('settings');
  const [settingsForm, setSettingsForm] = useState({});
  const [resumeForm, setResumeForm] = useState({ url: '' });

  // Data lists
  const [projects, setProjects] = useState([]);
  const [journey, setJourney] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [mediaList, setMediaList] = useState([]);

  // Forms editing/creating states
  const [editingProject, setEditingProject] = useState(null); // null means list view, 'new' means creating, {object} means editing
  const [projectForm, setProjectForm] = useState({});
  
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({});

  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({});

  // Certifications states
  const [certifications, setCertifications] = useState([]);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({});

  // Skills states
  const [skillsData, setSkillsData] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({});
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({});

  // Publications states
  const [publications, setPublications] = useState([]);
  const [editingPub, setEditingPub] = useState(null);
  const [pubForm, setPubForm] = useState({});

  // Media upload state
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaFolder, setMediaFolder] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState('');

  // Direct file uploads to Cloudinary for individual fields
  const [uploadingField, setUploadingField] = useState(null);

  const handleDirectUpload = async (file, folder, onComplete) => {
    if (!file) return;
    setUploadingField(folder);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await api.post(`/api/media/upload?folder=${folder}`, formData, true);
      if (res.success && res.url) {
        onComplete(res.url);
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  const renderUploadWidget = (folder, accept, currentValue, onComplete) => {
    const isUploading = uploadingField === folder;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => onComplete(e.target.value)}
            placeholder={`No file uploaded or enter direct url...`}
            className="flex-grow px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
          />
          <label className={`cursor-pointer px-4 py-2.5 rounded-xl text-white text-xs font-mono flex items-center gap-1.5 transition-all shrink-0 border border-white/5 ${
            isUploading 
              ? 'bg-slate-900 border-slate-700 pointer-events-none text-slate-500' 
              : 'bg-slate-800 hover:border-accent'
          }`}>
            <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin text-slate-500' : 'text-accent'}`} />
            <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
            <input
              type="file"
              accept={accept}
              disabled={isUploading}
              onChange={(e) => handleDirectUpload(e.target.files[0], folder, onComplete)}
              className="hidden"
            />
          </label>
        </div>
        {/* Progress or status bar */}
        <div className="h-1 w-full bg-slate-950/80 rounded overflow-hidden relative border border-white/5">
          {isUploading ? (
            <div className="h-full bg-accent animate-pulse w-3/4 transition-all duration-[4s]" />
          ) : currentValue ? (
            <div className="h-full bg-emerald-500 w-full" />
          ) : (
            <div className="h-full bg-slate-800 w-0" />
          )}
        </div>
        {currentValue && !isUploading && (
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Resource successfully synced to Cloudinary</span>
          </div>
        )}
      </div>
    );
  };

  const handleBlogGalleryUpload = async (file) => {
    if (!file) return;
    setUploadingField('blog_gallery');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await api.post('/api/media/upload?folder=blogs', formData, true);
      if (res.success && res.url) {
        const currentGallery = blogForm.gallery ? blogForm.gallery.trim() : '';
        const updatedGallery = currentGallery ? `${currentGallery}, ${res.url}` : res.url;
        setBlogForm({ ...blogForm, gallery: updatedGallery });
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  // Check auth session on load
  const checkAuth = async () => {
    try {
      const data = await api.get('/api/auth/me');
      if (data.authenticated) {
        setAuthenticated(true);
        setUser(data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Google GSI script load
  useEffect(() => {
    if (authenticated) return;
    
    // Load GSI client
    if (!window.google) {
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [authenticated]);

  // Load site settings once when unauthenticated to obtain Google Client ID
  useEffect(() => {
    if (authenticated || authLoading) return;
    api.get('/api/settings')
      .then(setSettingsForm)
      .catch(err => console.error('Failed to load settings in login view:', err));
  }, [authenticated, authLoading]);

  // Render Google Login Button once both script and Client ID are active
  useEffect(() => {
    if (authenticated || authLoading || !settingsForm.google_client_id) return;

    const initGoogle = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: settingsForm.google_client_id,
            callback: handleGoogleLoginResponse
          });
          
          const btnElem = document.getElementById("google-login-btn");
          if (btnElem) {
            window.google.accounts.id.renderButton(btnElem, {
              theme: "dark",
              size: "large",
              width: "300"
            });
          }
        } catch (err) {
          console.error("Google Auth init failed:", err);
        }
      } else {
        // Script loaded but not processed yet, retry shortly
        setTimeout(initGoogle, 250);
      }
    };

    initGoogle();
  }, [settingsForm.google_client_id, authenticated, authLoading]);

  // Load active tab data
  useEffect(() => {
    if (!authenticated) return;

    if (activeTab === 'settings') {
      api.get('/api/settings').then(setSettingsForm);
    } else if (activeTab === 'resume') {
      api.get('/api/settings/resume').then(setResumeForm);
    } else if (activeTab === 'projects') {
      api.get('/api/projects').then(setProjects);
    } else if (activeTab === 'journey') {
      api.get('/api/journey').then(setJourney);
    } else if (activeTab === 'blog') {
      api.get('/api/blog').then(setBlogs);
      api.get('/api/journey').then(setJourney);
    } else if (activeTab === 'media') {
      loadMedia();
    } else if (activeTab === 'certifications') {
      api.get('/api/certifications').then(setCertifications);
    } else if (activeTab === 'skills') {
      api.get('/api/skills/categories').then(setSkillsData);
    } else if (activeTab === 'publications') {
      api.get('/api/publications').then(setPublications);
    }
  }, [activeTab, authenticated]);

  const loadMedia = async () => {
    try {
      const mediaData = await api.get('/api/media');
      setMediaList(mediaData);
    } catch (err) {
      console.error(err);
    }
  };

  // Google Login Callback
  const handleGoogleLoginResponse = async (response) => {
    setLoginError('');
    try {
      const res = await api.post('/api/auth/google', { credential: response.credential });
      if (res.success) {
        setAuthenticated(true);
        setUser(res.user);
      }
    } catch (err) {
      setLoginError(err.message || 'Google Auth Verification Failed.');
    }
  };

  // Local Password Login Fallback
  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.post('/api/auth/local-login', { password });
      if (res.success) {
        setAuthenticated(true);
        setUser(res.user);
      }
    } catch (err) {
      setLoginError(err.message || 'Local login failed.');
    }
  };

  // Logout trigger
  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      setAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // Settings API CRUD
  // ----------------------------------------------------
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.put('/api/settings', settingsForm);
      setSettingsForm(updated);
      alert('Settings updated successfully!');
      if (onSettingsUpdated) onSettingsUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // Resume API CRUD
  // ----------------------------------------------------
  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.put('/api/settings/resume', resumeForm);
      setResumeForm(updated);
      alert('Resume url updated successfully!');
      if (onResumeUpdated) onResumeUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // Projects API CRUD
  // ----------------------------------------------------
  const initProjectForm = (proj = null) => {
    if (proj) {
      setEditingProject(proj.id);
      setProjectForm({
        ...proj,
        tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : '',
        tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : '',
        gallery: Array.isArray(proj.gallery) ? proj.gallery.join(', ') : ''
      });
    } else {
      setEditingProject('new');
      setProjectForm({
        title: '',
        slug: '',
        short_description: '',
        long_description: '',
        cover_image: '',
        gallery: '',
        tech_stack: '',
        github_url: '',
        demo_url: '',
        status: 'completed',
        tags: '',
        featured: false
      });
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    
    // Parse stacks & tags lists
    const body = {
      ...projectForm,
      tech_stack: projectForm.tech_stack ? projectForm.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : [],
      tags: projectForm.tags ? projectForm.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      gallery: projectForm.gallery ? projectForm.gallery.split(',').map(s => s.trim()).filter(Boolean) : []
    };

    try {
      if (editingProject === 'new') {
        const added = await api.post('/api/projects', body);
        setProjects([added, ...projects]);
      } else {
        const updated = await api.put(`/api/projects/${editingProject}`, body);
        setProjects(projects.map(p => p.id === editingProject ? updated : p));
      }
      setEditingProject(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this case study permanently?')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // Journey Milestone API CRUD
  // ----------------------------------------------------
  const initMilestoneForm = (ms = null) => {
    if (ms) {
      setEditingMilestone(ms.id);
      setMilestoneForm({
        ...ms,
        technologies_used: Array.isArray(ms.technologies_used) ? ms.technologies_used.join(', ') : '',
        gallery: Array.isArray(ms.gallery) ? ms.gallery.join(', ') : '',
        thumbnail: ms.thumbnail || ''
      });
    } else {
      setEditingMilestone('new');
      setMilestoneForm({
        title: '',
        date: '',
        description: '',
        category: 'Academics',
        lessons_learned: '',
        technologies_used: '',
        location: '',
        thumbnail: '',
        gallery: '',
        timeline_order: journey.length + 1
      });
    }
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...milestoneForm,
      technologies_used: milestoneForm.technologies_used ? milestoneForm.technologies_used.split(',').map(s => s.trim()).filter(Boolean) : [],
      gallery: milestoneForm.gallery ? milestoneForm.gallery.split(',').map(s => s.trim()).filter(Boolean) : []
    };

    try {
      if (editingMilestone === 'new') {
        const added = await api.post('/api/journey', body);
        setJourney([...journey, added].sort((a, b) => a.timeline_order - b.timeline_order));
      } else {
        const updated = await api.put(`/api/journey/${editingMilestone}`, body);
        setJourney(journey.map(j => j.id === editingMilestone ? updated : j).sort((a, b) => a.timeline_order - b.timeline_order));
      }
      setEditingMilestone(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteMilestone = async (id) => {
    if (!window.confirm('Delete this milestone permanently?')) return;
    try {
      await api.delete(`/api/journey/${id}`);
      setJourney(journey.filter(j => j.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // Blog API CRUD
  // ----------------------------------------------------
  const initBlogForm = (post = null) => {
    if (post) {
      setEditingBlog(post.id);
      setBlogForm({
        ...post,
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        gallery: Array.isArray(post.gallery) ? post.gallery.join(', ') : '',
        journey_id: post.journey_id || ''
      });
    } else {
      setEditingBlog('new');
      setBlogForm({
        title: '',
        slug: '',
        cover_image: '',
        reading_time: '5 min read',
        tags: '',
        category: 'Engineering',
        markdown_content: '',
        gallery: '',
        status: 'draft',
        journey_id: ''
      });
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...blogForm,
      tags: blogForm.tags ? blogForm.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      gallery: blogForm.gallery ? blogForm.gallery.split(',').map(s => s.trim()).filter(Boolean) : [],
      journey_id: blogForm.journey_id ? parseInt(blogForm.journey_id) : null
    };

    try {
      if (editingBlog === 'new') {
        const added = await api.post('/api/blog', body);
        setBlogs([added, ...blogs]);
      } else {
        const updated = await api.put(`/api/blog/${editingBlog}`, body);
        setBlogs(blogs.map(b => b.id === editingBlog ? updated : b));
      }
      setEditingBlog(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post permanently?')) return;
    try {
      await api.delete(`/api/blog/${id}`);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // Media Upload handlers
  // ----------------------------------------------------
  const handleMediaUpload = async (e) => {
    e.preventDefault();
    if (!mediaFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', mediaFile);

    try {
      await api.post(`/api/media/upload?folder=${mediaFolder}`, formData, true);
      setMediaFile(null);
      // Clear input
      document.getElementById('media-file-input').value = '';
      alert('Uploaded successfully!');
      loadMedia();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (publicId) => {
    if (!window.confirm('Delete this image from Cloudinary permanently?')) return;
    try {
      await api.delete('/api/media', { public_id: publicId });
      setMediaList(mediaList.filter(m => m.public_id !== publicId));
    } catch (err) {
      alert(err.message);
    }
  };

  const copyUrl = (url, publicId) => {
    navigator.clipboard.writeText(url);
    setCopiedId(publicId);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // ----------------------------------------------------
  // Certifications API CRUD
  // ----------------------------------------------------
  const initCertForm = (cert = null) => {
    if (cert) {
      setEditingCert(cert.id);
      setCertForm({ ...cert });
    } else {
      setEditingCert('new');
      setCertForm({
        title: '',
        issuer: '',
        date: '',
        verification_url: '',
        badge_image_url: '',
        certificate_pdf_url: '',
        badge_color: '#EA4335',
        type: 'cloud'
      });
    }
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCert === 'new') {
        const added = await api.post('/api/certifications', certForm);
        setCertifications([added, ...certifications]);
      } else {
        const updated = await api.put(`/api/certifications/${editingCert}`, certForm);
        setCertifications(certifications.map(c => c.id === editingCert ? updated : c));
      }
      setEditingCert(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteCert = async (id) => {
    if (!window.confirm('Delete this certification record?')) return;
    try {
      await api.delete(`/api/certifications/${id}`);
      setCertifications(certifications.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // Skills & Tools API CRUD
  // ----------------------------------------------------
  const initCategoryForm = (cat = null) => {
    if (cat) {
      setEditingCategory(cat.id);
      setCategoryForm({ ...cat });
    } else {
      setEditingCategory('new');
      setCategoryForm({
        category: '',
        description: '',
        display_order: 0
      });
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory === 'new') {
        const added = await api.post('/api/skills/categories', categoryForm);
        setSkillsData([...skillsData, { ...added, items: [] }]);
      } else {
        const updated = await api.put(`/api/skills/categories/${editingCategory}`, categoryForm);
        setSkillsData(skillsData.map(c => c.id === editingCategory ? { ...updated, items: c.items } : c));
      }
      setEditingCategory(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category and all its skills?')) return;
    try {
      await api.delete(`/api/skills/categories/${id}`);
      setSkillsData(skillsData.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const initSkillForm = (catId, skill = null) => {
    if (skill) {
      setEditingSkill(skill.id);
      setSkillForm({ ...skill });
    } else {
      setEditingSkill('new');
      setSkillForm({
        category_id: catId,
        name: '',
        level: 80,
        icon: 'Code2'
      });
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill === 'new') {
        const added = await api.post('/api/skills', skillForm);
        setSkillsData(skillsData.map(c => c.id === skillForm.category_id ? { ...c, items: [...c.items, added] } : c));
      } else {
        const updated = await api.put(`/api/skills/${editingSkill}`, skillForm);
        setSkillsData(skillsData.map(c => {
          if (c.items.some(s => s.id === editingSkill)) {
            return {
              ...c,
              items: c.items.map(s => s.id === editingSkill ? updated : s)
            };
          }
          return c;
        }));
      }
      setEditingSkill(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteSkill = async (catId, id) => {
    if (!window.confirm('Delete this skill item?')) return;
    try {
      await api.delete(`/api/skills/${id}`);
      setSkillsData(skillsData.map(c => c.id === catId ? { ...c, items: c.items.filter(s => s.id !== id) } : c));
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // Publications API CRUD
  // ----------------------------------------------------
  const initPubForm = (pub = null) => {
    if (pub) {
      setEditingPub(pub.id);
      setPubForm({ ...pub });
    } else {
      setEditingPub('new');
      setPubForm({
        title: '',
        authors: '',
        journal_or_conference: '',
        date: '',
        verification_url: '',
        pdf_url: ''
      });
    }
  };

  const handlePubSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPub === 'new') {
        const added = await api.post('/api/publications', pubForm);
        setPublications([added, ...publications]);
      } else {
        const updated = await api.put(`/api/publications/${editingPub}`, pubForm);
        setPublications(publications.map(p => p.id === editingPub ? updated : p));
      }
      setEditingPub(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deletePub = async (id) => {
    if (!window.confirm('Delete this publication record?')) return;
    try {
      await api.delete(`/api/publications/${id}`);
      setPublications(publications.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // Renders
  // ----------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 rounded-lg border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-slate-400">Verifying authorization system...</span>
      </div>
    );
  }

  // Login view if unauthenticated
  if (!authenticated) {
    return (
      <section className="py-24 min-h-screen flex items-center justify-center relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-md w-full mx-auto px-6 relative z-10">
          <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col items-center">
            
            {/* Lock logo */}
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-accent" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2 font-sans tracking-tight">Creator Studio Access</h1>
            <p className="text-xs text-slate-400 font-mono mb-8 text-center">
              Authenticate via whitelisted Google account or local token.
            </p>

            {loginError && (
              <div className="w-full p-3.5 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono text-center">
                {loginError}
              </div>
            )}

            {/* Google Sign-in Element */}
            <div className="w-full flex justify-center mb-6">
              <div id="google-login-btn"></div>
            </div>
            {!settingsForm.google_client_id && (
              <div className="text-[10px] font-mono text-slate-500 mb-6 text-center">
                Google Login is unconfigured (set GOOGLE_CLIENT_ID).
              </div>
            )}

            {/* Separator line */}
            <div className="w-full flex items-center justify-between gap-3 text-[10px] font-mono text-slate-500 mb-6 uppercase">
              <div className="h-px bg-white/5 flex-grow" />
              <span>OR bypass</span>
              <div className="h-px bg-white/5 flex-grow" />
            </div>

            {/* Fallback bypass form */}
            <form onSubmit={handleLocalLogin} className="w-full space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-2">BYPASS TOKEN / PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter bypass password..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-800 border border-white/5 hover:border-accent text-white font-mono text-xs font-bold transition-all"
              >
                Access Dashboard
              </button>
            </form>

          </div>
        </div>
      </section>
    );
  }

  // Dashboard admin layout
  return (
    <section className="py-24 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/5 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Creator Studio</h1>
            <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Creator: {user?.email || 'Authenticated'}</span>
              <span>•</span>
              <span className="text-accent">Write access enabled</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs font-mono flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Console Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Menu Navigation */}
          <nav className="lg:col-span-3 flex flex-row lg:flex-col flex-wrap gap-1.5 p-1 bg-slate-950/60 lg:p-2 rounded-2xl border border-white/5 backdrop-blur">
            {[
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'resume', label: 'Resume', icon: FileText },
              { id: 'projects', label: 'Projects', icon: Code },
              { id: 'journey', label: 'Journey', icon: Sparkles },
              { id: 'blog', label: 'Blog Posts', icon: BookOpen },
              { id: 'certifications', label: 'Certifications', icon: ShieldCheck },
              { id: 'skills', label: 'Skills & Tools', icon: Cpu },
              { id: 'publications', label: 'Publications', icon: Award },
              { id: 'media', label: 'Media Library', icon: ImageIcon }
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.id}
                  onClick={() => {
                    setActiveTab(btn.id);
                    setEditingProject(null);
                    setEditingMilestone(null);
                    setEditingBlog(null);
                  }}
                  className={`flex-grow lg:flex-grow-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    activeTab === btn.id
                      ? 'bg-accent text-white font-bold shadow-md shadow-accent/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Main Workspace Column */}
          <div className="lg:col-span-9 glass-panel rounded-3xl p-6 sm:p-8 border border-white/5">
            
            {/* 1. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-white pb-3 border-b border-white/5">Site Configuration</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-2">HERO HEADING / LOGO NAME</label>
                    <input
                      type="text"
                      value={settingsForm.hero_heading || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_heading: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-2">ACCENT COLOR (HEX)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settingsForm.accent_color || '#4F46E5'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accent_color: e.target.value })}
                        className="w-10 h-10 p-0.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settingsForm.accent_color || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accent_color: e.target.value })}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-2">BACKGROUND GRAPHICAL THEME</label>
                    <select
                      value={settingsForm.background_theme || 'beams'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, background_theme: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent font-mono"
                    >
                      <option value="beams">Cinematic Beams (React Bits 3D R3F) [Default]</option>
                      <option value="antigravity">Antigravity Particles (React Bits 3D R3F)</option>
                      <option value="tactical_mesh">Tactical Sonar Grid (2D Canvas)</option>
                    </select>
                  </div>

                {/* Background Tuning Control Panel */}
                {(() => {
                  let parsedBgConfig = settingsForm.background_config || {};
                  if (typeof parsedBgConfig === 'string') {
                    try {
                      parsedBgConfig = JSON.parse(parsedBgConfig);
                    } catch (e) {
                      parsedBgConfig = {};
                    }
                  }

                  const activeTheme = settingsForm.background_theme || parsedBgConfig.theme || 'beams';
                  const beamsData = {
                    beamWidth: 1.5,
                    beamHeight: 12,
                    beamNumber: 30,
                    lightColor: '#ffffff',
                    speed: 10,
                    noiseIntensity: 2.75,
                    scale: 0.35,
                    rotation: 0,
                    ...(parsedBgConfig.beams || {})
                  };
                  const antigravityData = {
                    count: 300,
                    magnetRadius: 10,
                    ringRadius: 10,
                    waveSpeed: 0.4,
                    waveAmplitude: 1,
                    particleSize: 2,
                    lerpSpeed: 0.1,
                    color: '#8c6b1a',
                    autoAnimate: false,
                    particleVariance: 1,
                    rotationSpeed: 0,
                    depthFactor: 1,
                    pulseSpeed: 3,
                    particleShape: 'capsule',
                    fieldStrength: 10,
                    ...(parsedBgConfig.antigravity || {})
                  };

                  const updateBgMetric = (type, key, value) => {
                    const updated = {
                      ...parsedBgConfig,
                      [type]: {
                        ...((type === 'beams' ? beamsData : antigravityData)),
                        [key]: value
                      }
                    };
                    setSettingsForm({
                      ...settingsForm,
                      background_config: updated
                    });
                  };

                  return (
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-mono font-bold text-accent">
                          BACKGROUND TUNING METRICS: {activeTheme.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Live Workspace Background Parameters</span>
                      </div>

                      {activeTheme === 'beams' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">BEAM WIDTH ({beamsData.beamWidth})</label>
                            <input
                              type="range" min="0.2" max="5.0" step="0.1"
                              value={beamsData.beamWidth}
                              onChange={(e) => updateBgMetric('beams', 'beamWidth', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">BEAM HEIGHT ({beamsData.beamHeight})</label>
                            <input
                              type="range" min="1" max="30" step="1"
                              value={beamsData.beamHeight}
                              onChange={(e) => updateBgMetric('beams', 'beamHeight', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">BEAM COUNT ({beamsData.beamNumber})</label>
                            <input
                              type="range" min="5" max="60" step="1"
                              value={beamsData.beamNumber}
                              onChange={(e) => updateBgMetric('beams', 'beamNumber', parseInt(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">SPEED ({beamsData.speed})</label>
                            <input
                              type="range" min="1" max="40" step="1"
                              value={beamsData.speed}
                              onChange={(e) => updateBgMetric('beams', 'speed', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">NOISE INTENSITY ({beamsData.noiseIntensity})</label>
                            <input
                              type="range" min="0" max="10" step="0.25"
                              value={beamsData.noiseIntensity}
                              onChange={(e) => updateBgMetric('beams', 'noiseIntensity', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">SCALE ({beamsData.scale})</label>
                            <input
                              type="range" min="0.1" max="2.0" step="0.05"
                              value={beamsData.scale}
                              onChange={(e) => updateBgMetric('beams', 'scale', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">ROTATION ({beamsData.rotation}°)</label>
                            <input
                              type="range" min="0" max="360" step="5"
                              value={beamsData.rotation}
                              onChange={(e) => updateBgMetric('beams', 'rotation', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">LIGHT COLOR</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={beamsData.lightColor}
                                onChange={(e) => updateBgMetric('beams', 'lightColor', e.target.value)}
                                className="w-8 h-8 p-0 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={beamsData.lightColor}
                                onChange={(e) => updateBgMetric('beams', 'lightColor', e.target.value)}
                                className="flex-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-[10px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTheme === 'antigravity' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">PARTICLE COUNT ({antigravityData.count})</label>
                            <input
                              type="range" min="50" max="800" step="10"
                              value={antigravityData.count}
                              onChange={(e) => updateBgMetric('antigravity', 'count', parseInt(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">PARTICLE SIZE ({antigravityData.particleSize})</label>
                            <input
                              type="range" min="0.5" max="8" step="0.5"
                              value={antigravityData.particleSize}
                              onChange={(e) => updateBgMetric('antigravity', 'particleSize', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">MAGNET RADIUS ({antigravityData.magnetRadius})</label>
                            <input
                              type="range" min="2" max="50" step="1"
                              value={antigravityData.magnetRadius}
                              onChange={(e) => updateBgMetric('antigravity', 'magnetRadius', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">RING RADIUS ({antigravityData.ringRadius})</label>
                            <input
                              type="range" min="2" max="50" step="1"
                              value={antigravityData.ringRadius}
                              onChange={(e) => updateBgMetric('antigravity', 'ringRadius', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">WAVE SPEED ({antigravityData.waveSpeed})</label>
                            <input
                              type="range" min="0.05" max="2.0" step="0.05"
                              value={antigravityData.waveSpeed}
                              onChange={(e) => updateBgMetric('antigravity', 'waveSpeed', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">WAVE AMPLITUDE ({antigravityData.waveAmplitude})</label>
                            <input
                              type="range" min="0.1" max="5.0" step="0.1"
                              value={antigravityData.waveAmplitude}
                              onChange={(e) => updateBgMetric('antigravity', 'waveAmplitude', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">FIELD STRENGTH ({antigravityData.fieldStrength})</label>
                            <input
                              type="range" min="1" max="50" step="1"
                              value={antigravityData.fieldStrength}
                              onChange={(e) => updateBgMetric('antigravity', 'fieldStrength', parseFloat(e.target.value))}
                              className="w-full accent-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">PARTICLE SHAPE</label>
                            <select
                              value={antigravityData.particleShape}
                              onChange={(e) => updateBgMetric('antigravity', 'particleShape', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-[10px]"
                            >
                              <option value="capsule">Capsule</option>
                              <option value="sphere">Sphere</option>
                              <option value="box">Box</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">PARTICLE COLOR</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={antigravityData.color}
                                onChange={(e) => updateBgMetric('antigravity', 'color', e.target.value)}
                                className="w-8 h-8 p-0 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={antigravityData.color}
                                onChange={(e) => updateBgMetric('antigravity', 'color', e.target.value)}
                                className="flex-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-[10px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTheme === 'tactical_mesh' && (
                        <div className="text-xs font-mono text-slate-400">
                          Standard 2D Tactical Sonar Grid canvas is active. Switch to Beams or Antigravity to customize 3D shader parameters.
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-2">HERO TAGLINE DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={settingsForm.hero_description || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-2">PROFILE PICTURE</label>
                    {renderUploadWidget('profile', 'image/*', settingsForm.profile_picture_url, (url) => setSettingsForm({ ...settingsForm, profile_picture_url: url }))}
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-2">FAVICON ICON</label>
                    {renderUploadWidget('favicon', 'image/*', settingsForm.favicon_url, (url) => setSettingsForm({ ...settingsForm, favicon_url: url }))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-2">ABOUT BIOGRAPHY TEXT</label>
                  <textarea
                    rows={4}
                    value={settingsForm.about_text || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, about_text: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-2">LOCATION</label>
                    <input
                      type="text"
                      value={settingsForm.location || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-2">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={settingsForm.email || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-2">SEO METADATA TITLE</label>
                    <input
                      type="text"
                      value={settingsForm.seo_title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seo_title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-2">GOOGLE AUTH CLIENT ID</label>
                    <input
                      type="text"
                      value={settingsForm.google_client_id || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, google_client_id: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-2">SEO METADATA DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={settingsForm.seo_description || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seo_description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-2">CURRENT FOCUS TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={Array.isArray(settingsForm.current_focus) ? settingsForm.current_focus.join(', ') : ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      current_focus: e.target.value.split(',').map(s => s.trim())
                    })}
                    placeholder="PatentEase, AI Agents, Robotics"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-2">QUICK FACTS / TYPING SLOGANS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={Array.isArray(settingsForm.quick_facts) ? settingsForm.quick_facts.join(', ') : ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      quick_facts: e.target.value.split(',').map(s => s.trim())
                    })}
                    placeholder="Final Year CS Student, AI Researcher, Full Stack"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Dossier & Status Metrics Management */}
                {(() => {
                  let dData = {
                    status: "Available for Internships",
                    location: "Bangalore, India",
                    education: "B.Tech CSE",
                    graduation: "2027",
                    currentMission: "Building PatentEase",
                    specialization: ["AI", "Backend", "Cloud"],
                    openTo: ["SDE", "AI Engineer", "Backend Engineer"],
                    stats: {
                      projects: "15+",
                      leadershipRoles: "3",
                      hackathons: "8",
                      teamsLed: "35+",
                      researchProjects: "2"
                    }
                  };

                  let rawD = settingsForm.dossier;
                  if (rawD) {
                    if (typeof rawD === 'object') dData = { ...dData, ...rawD };
                    else if (typeof rawD === 'string') {
                      try { dData = { ...dData, ...JSON.parse(rawD) }; } catch (e) {}
                    }
                  }

                  const updateDossierField = (field, val) => {
                    const updated = { ...dData, [field]: val };
                    setSettingsForm({ ...settingsForm, dossier: updated });
                  };

                  const updateDossierStats = (statKey, val) => {
                    const updated = {
                      ...dData,
                      stats: {
                        ...(dData.stats || {}),
                        [statKey]: val
                      }
                    };
                    setSettingsForm({ ...settingsForm, dossier: updated });
                  };

                  return (
                    <div className="p-5 rounded-xl bg-slate-950/80 border border-white/10 space-y-4 font-mono">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-accent">
                          DOSSIER & STATUS PANEL CONFIGURATION
                        </span>
                        <span className="text-[10px] text-slate-500">Sidebar Dossier Parameters</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">AVAILABILITY STATUS</label>
                          <input
                            type="text"
                            value={dData.status || ''}
                            onChange={(e) => updateDossierField('status', e.target.value)}
                            placeholder="Available for Internships"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">CURRENT MISSION</label>
                          <input
                            type="text"
                            value={dData.currentMission || ''}
                            onChange={(e) => updateDossierField('currentMission', e.target.value)}
                            placeholder="Building PatentEase"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">DEGREE / EDUCATION</label>
                          <input
                            type="text"
                            value={dData.education || ''}
                            onChange={(e) => updateDossierField('education', e.target.value)}
                            placeholder="B.Tech CSE"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">GRADUATION YEAR</label>
                          <input
                            type="text"
                            value={dData.graduation || ''}
                            onChange={(e) => updateDossierField('graduation', e.target.value)}
                            placeholder="2027"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">SPECIALIZATION (COMMA SEPARATED)</label>
                          <input
                            type="text"
                            value={Array.isArray(dData.specialization) ? dData.specialization.join(', ') : (dData.specialization || '')}
                            onChange={(e) => updateDossierField('specialization', e.target.value.split(',').map(s => s.trim()))}
                            placeholder="AI, Backend, Cloud"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">OPEN TO ROLES (COMMA SEPARATED)</label>
                          <input
                            type="text"
                            value={Array.isArray(dData.openTo) ? dData.openTo.join(', ') : (dData.openTo || '')}
                            onChange={(e) => updateDossierField('openTo', e.target.value.split(',').map(s => s.trim()))}
                            placeholder="SDE, AI Engineer, Backend Engineer"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      {/* Track Record Counters */}
                      <div className="border-t border-white/5 pt-3">
                        <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider font-bold">TRACK RECORD COUNTERS</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-[9px] text-slate-500 mb-1">PROJECTS</label>
                            <input
                              type="text"
                              value={dData.stats?.projects || ''}
                              onChange={(e) => updateDossierStats('projects', e.target.value)}
                              placeholder="15+"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-500 mb-1">LEADERSHIP</label>
                            <input
                              type="text"
                              value={dData.stats?.leadershipRoles || ''}
                              onChange={(e) => updateDossierStats('leadershipRoles', e.target.value)}
                              placeholder="3"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-500 mb-1">HACKATHONS</label>
                            <input
                              type="text"
                              value={dData.stats?.hackathons || ''}
                              onChange={(e) => updateDossierStats('hackathons', e.target.value)}
                              placeholder="8"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-500 mb-1">TEAMS LED</label>
                            <input
                              type="text"
                              value={dData.stats?.teamsLed || ''}
                              onChange={(e) => updateDossierStats('teamsLed', e.target.value)}
                              placeholder="35+"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-500 mb-1">RESEARCH</label>
                            <input
                              type="text"
                              value={dData.stats?.researchProjects || ''}
                              onChange={(e) => updateDossierStats('researchProjects', e.target.value)}
                              placeholder="2"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-2">FOOTER COPYRIGHT TEXT</label>
                  <input
                    type="text"
                    value={settingsForm.footer_text || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, footer_text: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-accent text-white font-mono font-bold text-xs shadow-lg shadow-accent/25 hover:brightness-110 transition-all"
                  >
                    Save Site Configuration
                  </button>
                </div>
              </form>
            )}

            {/* 2. RESUME TAB */}
            {activeTab === 'resume' && (
              <form onSubmit={handleResumeSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-white pb-3 border-b border-white/5">Resume File Settings</h2>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-2">RESUME PDF FILE (DRAG & DROP OR CHOOSE FILE)</label>
                  <div className="flex flex-col gap-3">
                    {renderUploadWidget('resume', 'application/pdf', resumeForm.url, (url) => setResumeForm({ ...resumeForm, url }))}
                    {resumeForm.url && (
                      <a 
                        href={resumeForm.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-accent hover:underline flex items-center gap-1 font-mono self-start"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Preview Uploaded Resume
                      </a>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-accent text-white font-mono font-bold text-xs shadow-lg shadow-accent/25 hover:brightness-110 transition-all"
                  >
                    Update Resume Document
                  </button>
                </div>
              </form>
            )}

            {/* 3. PROJECTS CRUD */}
            {activeTab === 'projects' && (
              <div>
                {editingProject === null ? (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-6">
                      <h2 className="text-xl font-bold text-white">Project Case Studies</h2>
                      <button
                        onClick={() => initProjectForm()}
                        className="px-4 py-2 rounded-xl bg-accent text-white font-mono text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse font-mono text-xs text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400">
                            <th className="py-3 pr-4">Title</th>
                            <th className="py-3 px-4">Slug</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Featured</th>
                            <th className="py-3 pl-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                          {projects.map((proj) => (
                            <tr key={proj.id} className="hover:bg-white/[0.02]">
                              <td className="py-3.5 pr-4 font-bold">{proj.title}</td>
                              <td className="py-3.5 px-4 text-slate-400">{proj.slug}</td>
                              <td className="py-3.5 px-4 capitalize">{proj.status}</td>
                              <td className="py-3.5 px-4">{proj.featured ? 'Yes' : 'No'}</td>
                              <td className="py-3.5 pl-4 text-right flex items-center justify-end gap-2.5">
                                <button
                                  onClick={() => initProjectForm(proj)}
                                  className="text-slate-400 hover:text-white"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteProject(proj.id)}
                                  className="text-slate-500 hover:text-rose-400"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProjectSubmit} className="space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                      <h2 className="text-xl font-bold text-white">
                        {editingProject === 'new' ? 'New Project Case Study' : 'Edit Case Study'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="text-xs font-mono text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">PROJECT TITLE *</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">SLUG (URL ROUTE) *</label>
                        <input
                          type="text"
                          required
                          value={projectForm.slug || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                          placeholder="patentease"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">SHORT DESCRIPTION *</label>
                      <input
                        type="text"
                        required
                        value={projectForm.short_description || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, short_description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">COVER IMAGE</label>
                      {renderUploadWidget('projects', 'image/*', projectForm.cover_image, (url) => setProjectForm({ ...projectForm, cover_image: url }))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">GITHUB URL</label>
                        <input
                          type="text"
                          value={projectForm.github_url || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">LIVE DEMO URL</label>
                        <input
                          type="text"
                          value={projectForm.demo_url || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, demo_url: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">STATUS</label>
                        <select
                          value={projectForm.status || 'completed'}
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        >
                          <option value="active">Active Development</option>
                          <option value="completed">Completed Build</option>
                          <option value="archived">Archived System</option>
                        </select>
                      </div>
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={projectForm.featured || false}
                            onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-accent focus:ring-accent"
                          />
                          <span>FEATURED PROJECT</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">TECH STACK (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        value={projectForm.tech_stack || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })}
                        placeholder="React, Node.js, ROS2"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">FILTER TAGS (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        value={projectForm.tags || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                        placeholder="AI, Full Stack, Robotics"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">ADDITIONAL GALLERY IMAGE URLS (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        value={projectForm.gallery || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, gallery: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">LONG DESCRIPTION / CASE STUDY (MARKDOWN)</label>
                      <textarea
                        rows={10}
                        value={projectForm.long_description || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, long_description: e.target.value })}
                        placeholder="## Overview&#10;Describe problems, solutions, architecture..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="pt-4 border-t border-white/5 flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-accent text-white font-mono font-bold text-xs shadow-lg shadow-accent/25 hover:brightness-110 transition-all"
                      >
                        {editingProject === 'new' ? 'Publish Project' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white text-xs font-mono transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 4. JOURNEY TIMELINE CRUD */}
            {activeTab === 'journey' && (
              <div>
                {editingMilestone === null ? (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-6">
                      <h2 className="text-xl font-bold text-white">Journey Growth Milestones</h2>
                      <button
                        onClick={() => initMilestoneForm()}
                        className="px-4 py-2 rounded-xl bg-accent text-white font-mono text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Milestone</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse font-mono text-xs text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400">
                            <th className="py-3 pr-4">Order</th>
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 pl-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                          {journey.map((item) => (
                            <tr key={item.id} className="hover:bg-white/[0.02]">
                              <td className="py-3.5 pr-4 text-accent font-bold">{item.timeline_order}</td>
                              <td className="py-3.5 px-4 font-bold">{item.title}</td>
                              <td className="py-3.5 px-4 text-slate-400">{item.date}</td>
                              <td className="py-3.5 px-4 capitalize">{item.category}</td>
                              <td className="py-3.5 pl-4 text-right flex items-center justify-end gap-2.5">
                                <button
                                  onClick={() => initMilestoneForm(item)}
                                  className="text-slate-400 hover:text-white"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteMilestone(item.id)}
                                  className="text-slate-500 hover:text-rose-400"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleMilestoneSubmit} className="space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                      <h2 className="text-xl font-bold text-white">
                        {editingMilestone === 'new' ? 'Create Journey Milestone' : 'Edit Milestone'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setEditingMilestone(null)}
                        className="text-xs font-mono text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">MILESTONE TITLE *</label>
                        <input
                          type="text"
                          required
                          value={milestoneForm.title || ''}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">DATE LABEL *</label>
                        <input
                          type="text"
                          required
                          value={milestoneForm.date || ''}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, date: e.target.value })}
                          placeholder="e.g. Sept 2025"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">CATEGORY *</label>
                        <select
                          value={milestoneForm.category || 'Academics'}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        >
                          <option value="Academics">Academics</option>
                          <option value="Projects">Projects</option>
                          <option value="Hackathon">Hackathon</option>
                          <option value="Leadership">Leadership</option>
                          <option value="Work">Work Experience</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">TIMELINE ORDER ORDER *</label>
                        <input
                          type="number"
                          required
                          value={milestoneForm.timeline_order || 0}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, timeline_order: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">LOCATION (OPTIONAL)</label>
                        <input
                          type="text"
                          value={milestoneForm.location || ''}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, location: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">SHORT SUMMARY DESCRIPTION *</label>
                      <textarea
                        rows={3}
                        required
                        value={milestoneForm.description || ''}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">LESSONS LEARNED (MARKDOWN / SEPARATED BY NEW LINES)</label>
                      <textarea
                        rows={4}
                        value={milestoneForm.lessons_learned || ''}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, lessons_learned: e.target.value })}
                        placeholder="Prioritize core functionality first...&#10;Write clean unit tests..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">TECHNOLOGIES USED (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        value={milestoneForm.technologies_used || ''}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, technologies_used: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">MILESTONE THUMBNAIL IMAGE</label>
                      {renderUploadWidget('journey', 'image/*', milestoneForm.thumbnail, (url) => setMilestoneForm({ ...milestoneForm, thumbnail: url }))}
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">GALLERY IMAGE URLS (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        value={milestoneForm.gallery || ''}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, gallery: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="pt-4 border-t border-white/5 flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-accent text-white font-mono font-bold text-xs shadow-lg shadow-accent/25 hover:brightness-110 transition-all"
                      >
                        {editingMilestone === 'new' ? 'Add Milestone' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMilestone(null)}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white text-xs font-mono transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 5. BLOG POSTS CRUD */}
            {activeTab === 'blog' && (
              <div>
                {editingBlog === null ? (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-6">
                      <h2 className="text-xl font-bold text-white">Journal & Blog Articles</h2>
                      <button
                        onClick={() => initBlogForm()}
                        className="px-4 py-2 rounded-xl bg-accent text-white font-mono text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Article</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse font-mono text-xs text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400">
                            <th className="py-3 pr-4">Title</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 pl-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                          {blogs.map((post) => (
                            <tr key={post.id} className="hover:bg-white/[0.02]">
                              <td className="py-3.5 pr-4 font-bold">{post.title}</td>
                              <td className="py-3.5 px-4 text-slate-400">{post.category}</td>
                              <td className="py-3.5 px-4 uppercase font-semibold">
                                <span className={post.status === 'published' ? 'text-emerald-400' : 'text-amber-500'}>
                                  {post.status}
                                </span>
                              </td>
                              <td className="py-3.5 pl-4 text-right flex items-center justify-end gap-2.5">
                                <button
                                  onClick={() => initBlogForm(post)}
                                  className="text-slate-400 hover:text-white"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteBlog(post.id)}
                                  className="text-slate-500 hover:text-rose-400"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBlogSubmit} className="space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                      <h2 className="text-xl font-bold text-white">
                        {editingBlog === 'new' ? 'New Journal Entry' : 'Edit Article'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setEditingBlog(null)}
                        className="text-xs font-mono text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">ARTICLE TITLE *</label>
                        <input
                          type="text"
                          required
                          value={blogForm.title || ''}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">SLUG ROUTE *</label>
                        <input
                          type="text"
                          required
                          value={blogForm.slug || ''}
                          onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                          placeholder="scaling-nodejs-backends"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">COVER IMAGE</label>
                      {renderUploadWidget('blog', 'image/*', blogForm.cover_image, (url) => setBlogForm({ ...blogForm, cover_image: url }))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">READING TIME</label>
                        <input
                          type="text"
                          value={blogForm.reading_time || ''}
                          onChange={(e) => setBlogForm({ ...blogForm, reading_time: e.target.value })}
                          placeholder="5 min read"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">STATUS</label>
                        <select
                          value={blogForm.status || 'draft'}
                          onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        >
                          <option value="draft">Draft Mode</option>
                          <option value="published">Published Live</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">CATEGORY *</label>
                        <select
                          value={blogForm.category || 'Engineering'}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="AI">AI</option>
                          <option value="Cycling">Cycling</option>
                          <option value="Movies">Movies</option>
                          <option value="Anime">Anime</option>
                          <option value="Life">Life Update</option>
                          <option value="Projects">Projects</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">TAGS (COMMA SEPARATED)</label>
                        <input
                          type="text"
                          value={blogForm.tags || ''}
                          onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                          placeholder="Node.js, Postgres, Setup"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">LINK TO JOURNEY MILESTONE</label>
                        <select
                          value={blogForm.journey_id || ''}
                          onChange={(e) => setBlogForm({ ...blogForm, journey_id: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        >
                          <option value="">-- None (No Link) --</option>
                          {journey.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.title} ({m.date})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">ARTICLE GALLERY IMAGES (COMMA SEPARATED)</label>
                      <div className="flex flex-col gap-3">
                        <textarea
                          rows={2}
                          value={blogForm.gallery || ''}
                          onChange={(e) => setBlogForm({ ...blogForm, gallery: e.target.value })}
                          placeholder="Image URLs (comma separated) or upload files below..."
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                        />
                        <div className="flex gap-2 items-center">
                          <label className={`cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 border border-white/5 hover:border-accent text-white text-xs font-mono flex items-center gap-1.5 transition-all ${
                            uploadingField === 'blog_gallery' ? 'pointer-events-none opacity-50' : ''
                          }`}>
                            <Upload className={`w-3.5 h-3.5 ${uploadingField === 'blog_gallery' ? 'animate-spin' : 'text-accent'}`} />
                            <span>{uploadingField === 'blog_gallery' ? 'Uploading Image...' : 'Upload Image to Gallery'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingField === 'blog_gallery'}
                              onChange={(e) => handleBlogGalleryUpload(e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                          {uploadingField === 'blog_gallery' && (
                            <span className="text-[10px] font-mono text-accent animate-pulse">Uploading asset to Cloudinary blogs folder...</span>
                          )}
                        </div>
                        {blogForm.gallery && (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2 p-3 bg-slate-950/40 rounded-xl border border-white/5">
                            {blogForm.gallery.split(',').map((url, imgIdx) => {
                              const cleanUrl = url.trim();
                              if (!cleanUrl) return null;
                              return (
                                <div key={imgIdx} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square">
                                  <img src={cleanUrl} alt="" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = blogForm.gallery.split(',')
                                        .map(s => s.trim())
                                        .filter((_, idx) => idx !== imgIdx)
                                        .join(', ');
                                      setBlogForm({ ...blogForm, gallery: filtered });
                                    }}
                                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Remove
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">MARKDOWN ARTICLE CONTENT *</label>
                      <textarea
                        rows={12}
                        required
                        value={blogForm.markdown_content || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, markdown_content: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="pt-4 border-t border-white/5 flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-accent text-white font-mono font-bold text-xs shadow-lg shadow-accent/25 hover:brightness-110 transition-all"
                      >
                        {editingBlog === 'new' ? 'Publish Article' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBlog(null)}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white text-xs font-mono transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 6. MEDIA LIBRARY TAB */}
            {activeTab === 'media' && (
              <div>
                <h2 className="text-xl font-bold text-white pb-3 border-b border-white/5 mb-6">Cloudinary Media Library</h2>

                {/* Upload Section */}
                <form onSubmit={handleMediaUpload} className="p-5 bg-slate-900/60 border border-white/5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:flex-grow">
                    <label className="block text-[9px] font-mono text-slate-500 mb-1.5">SELECT FILE (MAX 10MB)</label>
                    <input
                      id="media-file-input"
                      type="file"
                      required
                      onChange={(e) => setMediaFile(e.target.files[0])}
                      className="text-xs text-slate-400 w-full"
                    />
                  </div>
                  <div className="w-full sm:w-44">
                    <label className="block text-[9px] font-mono text-slate-500 mb-1.5">SUBFOLDER CATEGORY</label>
                    <select
                      value={mediaFolder}
                      onChange={(e) => setMediaFolder(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                    >
                      <option value="general">General</option>
                      <option value="profile">Profile</option>
                      <option value="projects">Projects</option>
                      <option value="journey">Journey</option>
                      <option value="blogs">Blogs</option>
                      <option value="documents">Documents</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={uploading || !mediaFile}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 self-end"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  </button>
                </form>

                {/* Media Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaList.map((media) => (
                    <div key={media.public_id} className="rounded-xl border border-white/5 overflow-hidden bg-slate-950 flex flex-col justify-between group relative">
                      {/* Image Thumbnail */}
                      <div className="h-28 bg-slate-900 relative border-b border-white/5 overflow-hidden flex items-center justify-center">
                        {media.resource_type === 'image' ? (
                          <img
                            src={media.secure_url}
                            alt={media.filename}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-[10px] font-mono text-slate-500 uppercase">{media.format || 'file'}</div>
                        )}
                        
                        {/* Hover triggers */}
                        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => copyUrl(media.secure_url, media.public_id)}
                            className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
                            title="Copy URL"
                          >
                            {copiedId === media.public_id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <a
                            href={media.secure_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
                            title="Open original"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* File Details */}
                      <div className="p-3">
                        <p className="text-[10px] font-mono text-slate-300 truncate" title={media.public_id}>
                          {media.public_id.split('/').pop()}
                        </p>
                        <p className="text-[9px] font-mono text-slate-500 mt-1 flex justify-between">
                          <span>{(media.bytes / 1024).toFixed(0)} KB</span>
                          <button
                            onClick={() => deleteMedia(media.public_id)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {mediaList.length === 0 && (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs">
                    Cloudinary storage is empty or folder not indexed yet.
                  </div>
                )}
              </div>
            )}

            {/* 7. CERTIFICATIONS TAB */}
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <h2 className="text-xl font-bold text-white">Certifications & Badges</h2>
                  {editingCert === null && (
                    <button
                      onClick={() => initCertForm()}
                      className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-mono text-xs font-bold hover:brightness-110 flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Certification</span>
                    </button>
                  )}
                </div>

                {editingCert !== null ? (
                  <form onSubmit={handleCertSubmit} className="space-y-6 bg-slate-900/30 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-sm font-mono text-slate-300 uppercase">
                      {editingCert === 'new' ? 'New Certification' : 'Edit Certification'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">TITLE</label>
                        <input
                          type="text"
                          required
                          value={certForm.title || ''}
                          onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">ISSUER</label>
                        <input
                          type="text"
                          required
                          value={certForm.issuer || ''}
                          onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">DATE (e.g. Dec 2025)</label>
                        <input
                          type="text"
                          required
                          value={certForm.date || ''}
                          onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">VERIFICATION LINK (URL)</label>
                        <input
                          type="text"
                          value={certForm.verification_url || ''}
                          onChange={(e) => setCertForm({ ...certForm, verification_url: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">BADGE COLOR (HEX)</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={certForm.badge_color || '#EA4335'}
                            onChange={(e) => setCertForm({ ...certForm, badge_color: e.target.value })}
                            className="w-10 h-10 p-0.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={certForm.badge_color || ''}
                            onChange={(e) => setCertForm({ ...certForm, badge_color: e.target.value })}
                            className="flex-grow px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">BADGE TYPE / ICON FALLBACK</label>
                        <select
                          value={certForm.type || 'cloud'}
                          onChange={(e) => setCertForm({ ...certForm, type: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent font-mono"
                        >
                          <option value="cloud">Cloud (Google Cloud, etc.)</option>
                          <option value="server">Server (AWS, Azure, etc.)</option>
                          <option value="robot">Robot (ROS2, Arduino, etc.)</option>
                          <option value="gdg">GDG / Community Contribution</option>
                          <option value="custom">Custom (Generic Shield)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">BADGE IMAGE UPLOAD</label>
                        {renderUploadWidget('cert_badge', 'image/*', certForm.badge_image_url, (url) => setCertForm({ ...certForm, badge_image_url: url }))}
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">VERIFICATION PDF UPLOAD</label>
                        {renderUploadWidget('cert_pdf', 'application/pdf', certForm.certificate_pdf_url, (url) => setCertForm({ ...certForm, certificate_pdf_url: url }))}
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingCert(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-mono font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-accent text-slate-950 text-xs font-mono font-bold hover:brightness-110"
                      >
                        {editingCert === 'new' ? 'Create Record' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between items-center p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center border relative overflow-hidden"
                            style={{ 
                              borderColor: `${cert.badge_color || '#EA4335'}33`,
                              backgroundColor: `${cert.badge_color || '#EA4335'}0d` 
                            }}
                          >
                            {cert.badge_image_url ? (
                              <img src={cert.badge_image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ShieldCheck className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white leading-snug">{cert.title}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{cert.issuer} • {cert.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => initCertForm(cert)}
                            className="p-2 rounded-lg bg-slate-800 border border-white/5 text-slate-400 hover:text-white hover:border-accent"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCert(cert.id)}
                            className="p-2 rounded-lg bg-slate-800 border border-white/5 text-slate-400 hover:text-rose-400 hover:border-rose-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {certifications.length === 0 && (
                      <div className="text-center py-12 text-slate-500 font-mono text-xs">
                        No certifications stored. Click "Add New Certification" to begin.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 8. SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-8">
                {/* Categories Head */}
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <h2 className="text-xl font-bold text-white">Skills & Technologies</h2>
                  {editingCategory === null && editingSkill === null && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => initCategoryForm()}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs font-bold hover:border-accent flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-4 h-4 text-accent" />
                        <span>Add Category</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit Category Mode */}
                {editingCategory !== null && (
                  <form onSubmit={handleCategorySubmit} className="space-y-4 bg-slate-900/30 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-sm font-mono text-slate-300 uppercase">
                      {editingCategory === 'new' ? 'New Skill Category' : 'Edit Category'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">CATEGORY TITLE</label>
                        <input
                          type="text"
                          required
                          value={categoryForm.category || ''}
                          onChange={(e) => setCategoryForm({ ...categoryForm, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">DISPLAY ORDER</label>
                        <input
                          type="number"
                          value={categoryForm.display_order || 0}
                          onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">CATEGORY DESCRIPTION</label>
                      <input
                        type="text"
                        value={categoryForm.description || ''}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 border border-white/5 text-xs font-mono font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-accent text-slate-950 text-xs font-mono font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}

                {/* Edit Skill Item Mode */}
                {editingSkill !== null && (
                  <form onSubmit={handleSkillSubmit} className="space-y-4 bg-slate-900/30 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-sm font-mono text-slate-300 uppercase">
                      {editingSkill === 'new' ? 'Add Skill Item' : 'Edit Skill Item'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">SKILL NAME</label>
                        <input
                          type="text"
                          required
                          value={skillForm.name || ''}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">PROFICIENCY LEVEL (%)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skillForm.level || 80}
                            onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) || 80 })}
                            className="flex-grow accent-accent"
                          />
                          <span className="text-xs text-white font-mono shrink-0 w-8">{skillForm.level || 80}%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">LUCIDE ICON NAME</label>
                        <select
                          value={skillForm.icon || 'Code2'}
                          onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent font-mono"
                        >
                          <option value="Code2">Code2</option>
                          <option value="FileCode">FileCode</option>
                          <option value="Palette">Palette</option>
                          <option value="Sparkles">Sparkles</option>
                          <option value="Box">Box</option>
                          <option value="Layers">Layers</option>
                          <option value="Server">Server</option>
                          <option value="Terminal">Terminal</option>
                          <option value="Database">Database</option>
                          <option value="Network">Network</option>
                          <option value="Zap">Zap</option>
                          <option value="Container">Container</option>
                          <option value="Cpu">Cpu</option>
                          <option value="Brain">Brain</option>
                          <option value="Cloud">Cloud</option>
                          <option value="CloudSun">CloudSun</option>
                          <option value="GitBranch">GitBranch</option>
                          <option value="ShieldCheck">ShieldCheck</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingSkill(null)}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 border border-white/5 text-xs font-mono font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-accent text-slate-950 text-xs font-mono font-bold"
                      >
                        Save Skill
                      </button>
                    </div>
                  </form>
                )}

                {/* List Categories & Nested Skills */}
                {editingCategory === null && editingSkill === null && (
                  <div className="space-y-6">
                    {skillsData.map((cat) => (
                      <div key={cat.id} className="p-6 rounded-2xl bg-slate-900/10 border border-white/5 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                          <div>
                            <h3 className="text-base font-bold text-white">{cat.category}</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">{cat.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => initSkillForm(cat.id)}
                              className="px-3 py-1.5 rounded-lg bg-slate-850 border border-white/5 text-[10px] font-mono text-accent hover:border-accent flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Skill</span>
                            </button>
                            <button
                              onClick={() => initCategoryForm(cat)}
                              className="p-1.5 rounded-lg bg-slate-800 border border-white/5 text-slate-400 hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteCategory(cat.id)}
                              className="p-1.5 rounded-lg bg-slate-800 border border-white/5 text-slate-400 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Items under category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {cat.items && cat.items.map((skill) => (
                            <div key={skill.id} className="flex justify-between items-center p-3.5 rounded-xl bg-slate-900/40 border border-white/5">
                              <div>
                                <span className="text-xs font-semibold text-white">{skill.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono ml-2">({skill.level}%)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => initSkillForm(cat.id, skill)}
                                  className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteSkill(cat.id, skill.id)}
                                  className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {(!cat.items || cat.items.length === 0) && (
                            <div className="col-span-full py-4 text-center text-slate-500 font-mono text-[10px]">
                              No skills listed under this category.
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 9. PUBLICATIONS TAB */}
            {activeTab === 'publications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <h2 className="text-xl font-bold text-white">Publications</h2>
                  {editingPub === null && (
                    <button
                      onClick={() => initPubForm()}
                      className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-mono text-xs font-bold hover:brightness-110 flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Publication</span>
                    </button>
                  )}
                </div>

                {editingPub !== null ? (
                  <form onSubmit={handlePubSubmit} className="space-y-6 bg-slate-900/30 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-sm font-mono text-slate-300 uppercase">
                      {editingPub === 'new' ? 'New Publication Record' : 'Edit Publication Record'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="col-span-full">
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">ARTICLE TITLE</label>
                        <input
                          type="text"
                          required
                          value={pubForm.title || ''}
                          onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">AUTHORS (e.g. Naveen S, et al.)</label>
                        <input
                          type="text"
                          value={pubForm.authors || ''}
                          onChange={(e) => setPubForm({ ...pubForm, authors: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">JOURNAL OR CONFERENCE</label>
                        <input
                          type="text"
                          value={pubForm.journal_or_conference || ''}
                          onChange={(e) => setPubForm({ ...pubForm, journal_or_conference: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">DATE (e.g. Nov 2025)</label>
                        <input
                          type="text"
                          required
                          value={pubForm.date || ''}
                          onChange={(e) => setPubForm({ ...pubForm, date: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-2">VERIFICATION LINK (URL)</label>
                        <input
                          type="text"
                          value={pubForm.verification_url || ''}
                          onChange={(e) => setPubForm({ ...pubForm, verification_url: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-2">PUBLICATION PDF UPLOAD</label>
                      {renderUploadWidget('publication_pdf', 'application/pdf', pubForm.pdf_url, (url) => setPubForm({ ...pubForm, pdf_url: url }))}
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingPub(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-mono font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-accent text-slate-950 text-xs font-mono font-bold hover:brightness-110"
                      >
                        {editingPub === 'new' ? 'Add Publication' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {publications.map((pub) => (
                      <div key={pub.id} className="flex justify-between items-center p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:border-white/10 transition-colors">
                        <div>
                          <h4 className="text-sm font-bold text-white leading-snug">{pub.title}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {pub.journal_or_conference || 'Research'} • {pub.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => initPubForm(pub)}
                            className="p-2 rounded-lg bg-slate-800 border border-white/5 text-slate-400 hover:text-white hover:border-accent"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deletePub(pub.id)}
                            className="p-2 rounded-lg bg-slate-800 border border-white/5 text-slate-400 hover:text-rose-400 hover:border-rose-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {publications.length === 0 && (
                      <div className="text-center py-12 text-slate-500 font-mono text-xs">
                        No publications recorded. Click "Add New Publication" to start.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
