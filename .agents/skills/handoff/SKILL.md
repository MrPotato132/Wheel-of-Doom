---
name: handoff
description: Generates a concise, high-context handoff prompt summarizing current progress, changes, and next steps to transfer seamlessly into another chat session.
---

# Handoff Skill

Use this skill whenever the user wants to conclude or pause their current conversation and transition to a fresh chat session without losing context, decisions, or architectural knowledge.

## Procedure

1. **Inspect Workspace Context**:
   - Check `AGENTS.md` and `CHANGELOG.md` to see the latest recorded milestones and architecture rules.
   - Check recently modified files or active tasks from the conversation.

2. **Generate the Handoff Brief**:
   Produce a clean, ready-to-copy markdown prompt containing:
   - **Project Name & Tech Stack**: (e.g. Wheel of Faith, pure HTML5/Vanilla JS/CSS, Web Audio API, Canvas physics).
   - **Recent Accomplishments**: Bulleted list of what was completed in the current session.
   - **Key Files & Locations**: Direct references to relevant code files (`js/wheelData.js`, `js/app.js`, etc.).
   - **Pending / Next Steps**: What the user or assistant should work on next.
   - **Instruction for the Incoming Agent**: Clear directive to review `AGENTS.md` and `CHANGELOG.md` upon starting.

3. **Format**:
   Provide the output inside a copyable markdown code block for one-click copying.
