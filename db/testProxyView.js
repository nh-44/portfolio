async function test() {
  const resumeUrl = 'https://res.cloudinary.com/jjw6qjpz/raw/private/s--ohotyW30--/v1784740593/portfolio/resume/Resume_Naveen_S_GKN.pdf';
  const proxyUrl = `http://localhost:5000/api/media/view?url=${encodeURIComponent(resumeUrl)}`;
  console.log(`Testing backend proxy view: ${proxyUrl}`);

  try {
    const res = await fetch(proxyUrl);
    console.log(`Proxy Response HTTP Status: ${res.status}`);
    console.log('Response Headers:');
    res.headers.forEach((val, key) => {
      console.log(`  ${key}: ${val}`);
    });

    if (res.ok) {
      const buf = await res.arrayBuffer();
      console.log(`✓ SUCCESS! Server successfully fetched, signed, and proxied the file! Size: ${buf.byteLength} bytes.`);
    } else {
      console.log('✗ FAILED: Server returned error', res.status);
      const text = await res.text();
      console.log('Error details:', text);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

test();
