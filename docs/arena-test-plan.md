### Instructions:
* Open a new issue and use the format of 'Manual test run' + app + version in the title.
* Use the label of 'QA' for the new issue.
* Update https://github.com/dxos/gravity/blob/main/docs/content/qa/index.md with a link to the new issue.
* If any bugs are found, open new issues if they don't already exist. Add links into the test issue. Add a comment on the issue of the format "Feature: Name of feature : BROKEN"
* Update https://github.com/dxos/gravity/blob/main/docs/content/qa/index.md with a list of broken features with links to the issues.
* When a manual test is added to automation via playwright, remove it from the template.
* Test using 2 machines with 2 different browsers (Brave / Chrome / Firefox are initial targets).
* If that's not possible, use two different profiles of Chrome / Brave on a single machine.
* Reset browser local storage between test runs.
* Each daily run should be a comment in the testing tracking issue with the form below filled out.
* Each person on the QA duty should attach at least one screen recording per week.

### Details:
- [ ] Date: _____
- [ ] Arena version: _____
- [ ] KUBE: _____
- [ ] Using: 1 machine / 2 machines
- [ ] Browser 1: _____
- [ ] Browser 2: _____
- [ ] Video recording: _____ / nope

### Setup:
- [ ] Reset both browsers storage

### Kube/Console:
- [ ] Open Your browser and go to https://apollo1.kube.moon.dxos.network/ on both machines 
- [ ] Click on Apps on both machines
- [ ] Click on Arena@Alpha on both machines

### Basic functionality:
- [ ] Create new identity on Machine A
- [ ] Download seed phrase on Machine A
- [ ] Create new identity on Machine B 
- [ ] Create new party on Machine A
- [ ] Invite Machine B from Machine A
- [ ] Join the party from Machine B
- [ ] Create another party from Machine A and verify Machine B is stated as 'connected'
- [ ] Redeem invitation from Machine B checking offline

### Messenger:
- [ ] Create chat room
- [ ] Post from Machine A
- [ ] Post from Machine B
- [ ] Download chat logs as markdown
- [ ] Join video chat from Machine A
- [ ] Verify that audio/video selection works 
- [ ] Join video chat from Machine B
- [ ] Verify that both video and audio work well on both machines
- [ ] Leave video chat on Machine A
- [ ] Leave video chat on Machine B
- [ ] Reference existing chess game in messenger
- [ ] Start new chess game in messenger

### Chess game (player vs player):
- [ ] Create new chess game from Machine A (A white, B black)
- [ ] Play 4 moves each machine
- [ ] Rewind the game and then return to current state on Machine A
- [ ] Play 2 more moves from each machine 

### Messenger inside game
- [ ] Open messenger and send a message from Machine A
- [ ] Open messenger and reply from Machine B
- [ ] Verify that both user names are displayed correctly
- [ ] Join video/audio chat from Machine A
- [ ] Join video/audio chat from Machine B
- [ ] Verify that chat layout fits on single screen for both machines
- [ ] Verify that video/audio chat works well on both machines
- [ ] Leave audio/video chat on Machine A
- [ ] Leave audio/video chat on Machine B
- [ ] Close messenger view on Machine A
- [ ] Close messenger view on Machine B
- [ ] Reopen messenger view on Machine A and confirm that all the messages and names are still there

### Bots:
- [ ] Invite chess bot to party (use dxos/bot/chess)
- [ ] Start new chess game between machine A and chess bot
- [ ] Invite multiple chess bots to party
- [ ] Complete a game, attempt to start a second game
- [ ] Start 3 simultaneous games with chess bot. Cycle through the games and make sure that chess bot responds with each turn.

### Parties operations:
- [ ] Rename party
- [ ] Archive party
- [ ] Verify that You can see archived parties
- [ ] Unarchive party
- [ ] Verify that You can see the unarchived party
- [ ] Download party to localhost
- [ ] Restore party form localhost
- [ ] Rename documents inside party
- [ ] Save party to IPFS
- [ ] Load party from IPFS
- [ ] Reset storage from home screen
