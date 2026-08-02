/**
 * WAYNE_SEC :: BREACH PROTOCOL
 * A small terminal text-adventure for the portfolio terminal.
 *
 * Integration:
 *   import { gameEngine } from './games/wayneSecGame';
 *
 *   // In your terminal's command handler:
 *   if (input === 'play' || input === 'game') {
 *     gameEngine.start();
 *     print(gameEngine.currentText());
 *     setMode('game'); // route subsequent input to gameEngine instead of normal commands
 *     return;
 *   }
 *
 *   // While in game mode:
 *   if (mode === 'game') {
 *     if (input === 'exit' || input === 'quit') {
 *       gameEngine.reset();
 *       setMode('normal');
 *       print('Exited WAYNE_SEC. Type `help` for commands.');
 *       return;
 *     }
 *     const result = gameEngine.choose(input);
 *     print(result.text);
 *     if (result.done) setMode('normal');
 *     return;
 *   }
 */

const SCENES = {
  start: {
    text: [
      '========================================',
      '  WAYNE_SEC :: BREACH PROTOCOL v1.0',
      '========================================',
      '',
      '23:41. An encrypted ping hits your terminal. No sender name.',
      'Just a file: gotham_infra.dat, and one line of text --',
      '',
      '  "Someone is going to hit three city systems tonight.',
      '   I need a second set of eyes. You in?"',
      '',
      '  [1] Accept the job',
      '  [2] Trace the sender first',
    ].join('\n'),
    choices: {
      '1': 'briefing',
      '2': 'trace',
    },
  },

  trace: {
    text: [
      'You run a quick trace on the ping. Bounced through six relays,',
      'the last one registered to a shell company: "Wayne Applied Sciences."',
      '',
      'Interesting. Whoever this is, they have real resources.',
      '',
      '  [1] Accept the job anyway',
      '  [2] Decline -- too risky',
    ].join('\n'),
    choices: {
      '1': 'briefing',
      '2': 'endDecline',
    },
  },

  briefing: {
    text: [
      'Three targets, all on a countdown:',
      '  A. GCPD records server   (integrity risk)',
      '  B. Power grid substation  (availability risk)',
      '  C. Ace Chemicals control  (safety risk -- highest priority)',
      '',
      'You only have time to properly secure ONE before midnight.',
      'The other two you can only patch fast and hope.',
      '',
      '  [A] Prioritize GCPD records',
      '  [B] Prioritize the power grid',
      '  [C] Prioritize Ace Chemicals',
    ].join('\n'),
    choices: {
      a: 'gcpd',
      b: 'grid',
      c: 'chemicals',
    },
  },

  gcpd: {
    text: [
      'You lock down GCPD first. Clean signature-based auth, rotated keys,',
      'the works. Solid. But your rushed patches on the grid and Ace',
      'Chemicals barely hold under a real attempt.',
      '',
      'At 23:58, sirens start a few blocks toward the harbor.',
      'Something got through -- just not here.',
      '',
      '  [1] Continue',
    ].join('\n'),
    choices: { '1': 'endPartial' },
  },

  grid: {
    text: [
      'You harden the substation -- rate limiting, anomaly detection,',
      'a honeypot to waste the attacker\'s time. It holds.',
      '',
      'Ace Chemicals is a bigger gamble. Your rushed patch buys minutes,',
      'not hours.',
      '',
      '  [1] Continue',
    ].join('\n'),
    choices: { '1': 'endPartial' },
  },

  chemicals: {
    text: [
      'You go all-in on Ace Chemicals -- this is the one where a breach',
      'means more than stolen data. Full lockdown, physical interlocks',
      'digitally verified, the works.',
      '',
      'Just before midnight, an intrusion attempt hits the chemical',
      'control system and slams straight into your wall. It does not',
      'get through.',
      '',
      '  [1] Continue',
    ].join('\n'),
    choices: { '1': 'endBest' },
  },

  endBest: {
    text: [
      '00:03. Your terminal pings once more:',
      '',
      '  "Ace Chemicals held. Nobody gets hurt tonight because of that.',
      '   The other two took damage, but nothing that can\'t be rebuilt.',
      '   Good instincts -- you protected people, not just data."',
      '',
      '  -- unsigned',
      '',
      '========================================',
      '  BREACH CONTAINED. Priority: correct.',
      '========================================',
      '',
      'Type `exit` to return to the terminal, or `play` to run it again.',
    ].join('\n'),
    end: true,
  },

  endPartial: {
    text: [
      '00:07. One more ping:',
      '',
      '  "Could have been worse. Could have been better.',
      '   Next time, ask what\'s actually at stake before you triage."',
      '',
      '  -- unsigned',
      '',
      '========================================',
      '  BREACH PARTIALLY CONTAINED.',
      '========================================',
      '',
      'Type `exit` to return to the terminal, or `play` to try again.',
    ].join('\n'),
    end: true,
  },

  endDecline: {
    text: [
      'You let it go. No reply comes.',
      '',
      'The next morning, the news says three city systems went down',
      'overnight. No injuries reported. This time.',
      '',
      '========================================',
      '  YOU WALKED AWAY. Gotham managed anyway.',
      '========================================',
      '',
      'Type `exit` to return to the terminal, or `play` to try again.',
    ].join('\n'),
    end: true,
  },
};

function createGameEngine(scenes, startScene = 'start') {
  let current = startScene;

  return {
    start() {
      current = startScene;
    },
    reset() {
      current = startScene;
    },
    currentText() {
      return scenes[current].text;
    },
    choose(rawInput) {
      const input = String(rawInput).trim().toLowerCase();
      const scene = scenes[current];

      if (scene.end) {
        return { text: scene.text, done: true };
      }

      const next = scene.choices[input];
      if (!next) {
        return {
          text: `Not a valid choice. Try: ${Object.keys(scene.choices).join(', ')}`,
          done: false,
        };
      }

      current = next;
      const nextScene = scenes[current];
      return { text: nextScene.text, done: Boolean(nextScene.end) };
    },
  };
}

export const gameEngine = createGameEngine(SCENES);
