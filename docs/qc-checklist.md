# QC CheckList

## Suite 1: Authentication · TC-001 – TC-014

---

### TC-001 · P0
**Sign-in page renders with branding, email/password fields, Login button, and Sign up link.**

- [ ] 1. Go to `/sign-in` in your browser.
- [ ] 2. Confirm the following are all visible: the heading "Login to your account"; "OpenHire" branding with an "Alpha" badge; an Email field; a Password field; a "Login" button; a "Sign up" link.
- [ ] 3. Open browser DevTools (F12 → Console tab) — confirm no red error messages are present.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-002 · P0
**Login button is disabled when both form fields are empty.**

- [ ] 1. Load `/sign-in` fresh (or clear both fields).
- [ ] 2. Without typing anything, confirm the "Login" button appears grayed out and cannot be clicked.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-003 · P0
**Typing an invalid email shows "Invalid email address" under the field.**

- [ ] 1. On the sign-in page, type `notanemail` into the Email field.
- [ ] 2. Press Tab or click elsewhere to move focus away from the field.
- [ ] 3. Confirm the error message "Invalid email address" appears below the Email field.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-004 · P0
**A password shorter than 8 characters shows a length validation error.**

- [ ] 1. On the sign-in page, type `abc1!` into the Password field.
- [ ] 2. Press Tab or click elsewhere to move focus away.
- [ ] 3. Confirm the error "Password must be at least 8 characters long" appears below the Password field.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-005 · P0
**A password with no special character shows a complexity validation error.**

- [ ] 1. On the sign-in page, type `password123` (letters and digits, no special character) into the Password field.
- [ ] 2. Press Tab or click elsewhere to move focus away.
- [ ] 3. Confirm the error "Password must contain at least one letter, one number, and one special character" appears.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-006 · P0
**Login button becomes enabled when both fields contain valid-format values.**

- [ ] 1. On the sign-in page, type `valid@example.com` into Email and `WrongPwd1!` into Password.
- [ ] 2. Confirm both fields have values and no red validation errors are shown.
- [ ] 3. Confirm the "Login" button is now active and clickable (no longer grayed out).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-007 · P0
**Submitting with valid-format but wrong credentials shows an error toast; page stays on sign-in.**

- [ ] 1. On the sign-in page, type `valid@example.com` and `WrongPwd1!` into the fields.
- [ ] 2. Click the "Login" button.
- [ ] 3. Wait for an error toast or message indicating the login failed (e.g. "Invalid credentials" or similar).
- [ ] 4. Confirm the browser address bar still shows `/sign-in` — you were not redirected.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** _(Toast auto-dismisses in ~4 s)_ ___

---

### TC-008 · P0
**Sign-up page renders with all required fields and controls.**

- [ ] 1. Go to `/sign-up` in your browser.
- [ ] 2. Confirm the following are all visible: heading "Create your account"; a Full Name field; an Email field; a Password field; a "Create account" button; a "Sign in" link.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-009 · P0
**"Create account" button is disabled when the sign-up form is empty.**

- [ ] 1. Load `/sign-up` fresh (or clear all fields).
- [ ] 2. Without typing anything, confirm the "Create account" button is grayed out and cannot be clicked.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-010 · P0
**Signing up with a unique email and valid password creates an account and redirects to the dashboard.**

- [ ] 1. Go to `/sign-up`.
- [ ] 2. Type your **Test full name** into the Full Name field, your **Test email** into Email, and your **Test password** into Password.
- [ ] 3. Confirm all three fields are filled and the "Create account" button becomes active.
- [ ] 4. Click "Create account".
- [ ] 5. Confirm the browser redirects to `/` (the dashboard).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-011 · P0
**Post sign-up redirect lands on the dashboard showing zero interviews.**

- [ ] 1. Immediately after TC-010, confirm the browser address bar shows `/`.
- [ ] 2. Confirm the dashboard displays an empty state — something like "0 Interviews created" — since this is a brand-new account.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-012 · P0
**Clicking Logout redirects to /sign-in and shows a success toast.**

- [ ] 1. While logged in on the dashboard, locate and click the Logout button (typically in the sidebar footer or user menu).
- [ ] 2. Wait for the "Logged out successfully" toast to appear.
- [ ] 3. Confirm the browser address bar shows `/sign-in`.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-013 · P0
**Accessing `/` while unauthenticated automatically redirects to /sign-in.**

- [ ] 1. While logged out (e.g., after TC-012), navigate directly to `/` (the root URL) in your browser.
- [ ] 2. Confirm the browser automatically redirects to `/sign-in` without any manual action.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-014 · P0
**Signing in with an existing account succeeds and shows the dashboard with user info in the sidebar.**

- [ ] 1. Go to `/sign-in`.
- [ ] 2. Enter your **Existing account email** and **Existing account password** into the fields.
- [ ] 3. Confirm the "Login" button becomes active, then click it.
- [ ] 4. Confirm the dashboard loads and the sidebar footer area shows the account's display name and email address.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

## Suite 2: Dashboard · TC-015 – TC-020

---

### TC-015 · P1
**Dashboard layout renders correctly: sidebar, branding, Interviews nav, and main content area.**

- [ ] 1. While logged in, go to `/`.
- [ ] 2. Confirm all of the following are visible: a sidebar panel; "OpenHire" branding with an "Alpha" badge in the sidebar; an "Interviews" navigation item that is active/highlighted; a main content area showing either the interview list or an empty state.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-016 · P1
**Sidebar footer displays the logged-in user's name and email.**

- [ ] 1. While logged in, look at the sidebar footer area.
- [ ] 2. Confirm your account's full name and email address are both visible there.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-017 · P1
**Sidebar toggle collapses the sidebar to icon-only mode and expands it back.**

- [ ] 1. While the sidebar is fully expanded, click the sidebar toggle/collapse button (chevron or hamburger icon at the sidebar edge).
- [ ] 2. Confirm the sidebar collapses to a narrow strip showing only icons — text labels are hidden.
- [ ] 3. Click the toggle button again.
- [ ] 4. Confirm the sidebar expands back to full width with text labels visible.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-018 · P1
**Clicking "Create an Interview" opens the creation dialog with all Step 1 fields.**

- [ ] 1. On the dashboard, click the "Create an Interview" button or card.
- [ ] 2. Confirm a dialog/modal opens with the heading "Create an Interview".
- [ ] 3. Confirm all of the following are present in the dialog: an Interview Name input; a row of interviewer selection cards; a Number of Questions input; a Duration input; an Objective text area; a file upload area; an "Anonymous responses?" toggle switch.
- [ ] 4. *(Note: a non-critical accessibility warning in the console related to the dialog is a known issue — BUG-001. It does not fail this test.)*

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-019 · P1
**"Interviews" sidebar nav link navigates to the dashboard.**

- [ ] 1. While on any sub-page (e.g., an interview detail page), click "Interviews" in the sidebar navigation.
- [ ] 2. Confirm the browser address bar shows `/` after the navigation.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-020 · P1
**"Copy interview link" button copies the call URL to clipboard and shows a toast.**

> **Precondition:** TC-033 must be completed so **Interview ID** is filled in the Config table.

- [ ] 1. On the dashboard, find the interview card for your **Interview name** and click its "Copy interview link" button (chain-link icon).
- [ ] 2. Wait for the toast "The link to your interview has been copied to your clipboard." to appear.
- [ ] 3. Paste the clipboard contents somewhere (e.g., the address bar or a text editor) and confirm the URL is `[App URL]/call/[Interview ID]`.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

## Suite 3: Create Interview · TC-021 – TC-037

---

### TC-021 · P1
**Interview Name field accepts text input.**

> **Precondition:** "Create an Interview" dialog is open on Step 1.

- [ ] 1. In the Interview Name field, type your **Interview name** (e.g., `QA Checklist Interview`).
- [ ] 2. Confirm the field shows the text you typed with no validation error.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-022 · P1
**Clicking an interviewer card highlights it with a primary-color border.**

- [ ] 1. In the Create Interview dialog, click the interviewer card labelled **Interviewer to select** (e.g., "Explorer Lisa").
- [ ] 2. Confirm that card now has a visually distinct colored border (highlight), and the other cards do not.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-023 · P1
**Number of Questions field accepts a valid integer.**

- [ ] 1. Click into the Number of Questions field.
- [ ] 2. Type `3`.
- [ ] 3. Confirm the field shows the value `3` with no error.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-024 · P1
**Duration field accepts a valid integer.**

- [ ] 1. Click into the Duration (minutes) field.
- [ ] 2. Type `10`.
- [ ] 3. Confirm the field shows the value `10` with no error.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-025 · P1
**Objective textarea accepts text input.**

- [ ] 1. Click into the Objective field.
- [ ] 2. Type `Find best candidates based on their technical skills and previous projects.`
- [ ] 3. Confirm the text appears in the field (the field may expand vertically to fit).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-026 · P1
**Both proceed buttons stay disabled until all required Step 1 fields are valid.**

- [ ] 1. Fill only the Interview Name field; leave interviewer, questions, duration, and objective empty.
- [ ] 2. Confirm both "Create questions myself" and "✨ Generate questions" buttons are grayed out.
- [ ] 3. Now also select an interviewer card, enter `3` in Number of Questions, enter `10` in Duration — but leave Objective empty.
- [ ] 4. Confirm both buttons are still grayed out (Objective is required).
- [ ] 5. Type something in the Objective field.
- [ ] 6. Confirm both "Create questions myself" and "✨ Generate questions" buttons are now active and clickable.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-027 · P1
**"Create questions myself" button is enabled when all Step 1 required fields are valid.**

> **Precondition:** All Step 1 fields filled (TC-026 final state).

- [ ] 1. Confirm the "Create questions myself" button is active (not grayed out).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-028 · P1
**"✨ Generate questions" button is enabled when all Step 1 required fields are valid.**

> **Precondition:** All Step 1 fields filled (TC-026 final state).

- [ ] 1. Confirm the "✨ Generate questions" button is active (not grayed out).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-029 · P1
**"Anonymous responses?" toggle switches on and off.**

- [ ] 1. In the Create Interview dialog, locate the "Anonymous responses?" toggle switch and note its initial state (should be off/unchecked by default).
- [ ] 2. Click the toggle.
- [ ] 3. Confirm it turns on (filled/checked appearance).
- [ ] 4. Click it again.
- [ ] 5. Confirm it turns off (empty/unchecked appearance).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-030 · P2
**File upload area renders with a drag-and-drop hint and PDF format label.**

- [ ] 1. In the Create Interview dialog, look at the file upload section.
- [ ] 2. Confirm hint text such as "Drag & drop files or Browse" is visible.
- [ ] 3. Confirm a format note such as "Supported formats: PDF" is also visible.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-031 · P1
**Step 2 renders with question cards, depth level selectors (Low/Medium/High), Back, and Save buttons.**

> **Precondition:** All Step 1 fields are valid (TC-026 final state).

- [ ] 1. Click the "Create questions myself" button.
- [ ] 2. Confirm Step 2 loads with at least one question card visible.
- [ ] 3. Confirm each question card has a difficulty/depth selector with options Low, Medium, and High.
- [ ] 4. Confirm a "Back" button and a "Save" button are both present on this view.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-032 · P1
**"+" button adds question cards up to the configured count, then disappears.**

> **Precondition:** Step 2 is open; Number of Questions was set to 3; one question card is visible.

- [ ] 1. Click the "+" (add question) button.
- [ ] 2. Confirm a second question card appears and the "+" button is still visible.
- [ ] 3. Click "+" again.
- [ ] 4. Confirm a third question card appears and the "+" button disappears (the maximum of 3 is reached).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-033 · P0
**Filling all question cards and saving creates the interview and returns to the dashboard.**

> **Precondition:** Step 2 open with 3 question cards (TC-032 completed).

- [ ] 1. Type a unique question into each of the 3 question cards (e.g., "Tell me about your background.", "Describe a challenging project.", "How do you handle deadlines?").
- [ ] 2. Confirm all 3 cards have text and the "Save" button becomes active.
- [ ] 3. Click "Save".
- [ ] 4. Confirm the dialog closes and the dashboard is shown.
- [ ] 5. Confirm the dashboard now shows the interview card with your **Interview name**.
- [ ] 6. Click the new interview card to open its detail page.
- [ ] 7. Copy the interview ID from the browser address bar (e.g., from `/interviews/abc123`, the ID is `abc123`) and record it in the **Interview ID** row of the Config table above.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** _(Record Interview ID in Config!)_ ___

---

### TC-034 · P1
**Save button stays disabled when fewer question cards are filled than the configured count.**

> **Precondition:** Step 2 open with Number of Questions = 3; at least one card's text field is empty.

- [ ] 1. Leave at least one question card's text field blank.
- [ ] 2. Confirm the "Save" button is grayed out and cannot be clicked.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-035 · P1
**Trash button removes a question card; "+" reappears; Save becomes disabled.**

> **Precondition:** Step 2 with 3 filled question cards and "+" button hidden.

- [ ] 1. Click the delete/trash icon on the third question card.
- [ ] 2. Confirm the third card is removed (2 cards remain).
- [ ] 3. Confirm the "+" button has reappeared (since the count is now below the maximum).
- [ ] 4. Confirm the "Save" button is grayed out (2 filled cards is below the required 3).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-036 · P2
**"✨ Generate questions" calls the AI API and auto-populates Step 2 with generated questions.**

> **Pre-skipped** — Requires a live OpenAI API key. Re-enable when `OPENAI_API_KEY` is set and the generate endpoint is reachable.

- [ ] 1. With all Step 1 fields valid, click "✨ Generate questions".
- [ ] 2. Confirm an API request fires and Step 2 loads with AI-generated question texts pre-filled in the cards.

**Result:** ☑ SKIP   **Reason:** Requires live OpenAI API key   **Notes:** ___

---

### TC-037 · P1
**"Back" in Step 2 returns to Step 1 with all previously entered fields preserved.**

> **Precondition:** In Step 2 (reached via "Create questions myself"); Step 1 was fully filled.

- [ ] 1. Click the "Back" button in Step 2.
- [ ] 2. Confirm Step 1 is shown again.
- [ ] 3. Confirm all previously entered values are still there: the Interview Name, the selected interviewer card (still highlighted), Number of Questions showing `3`, Duration showing `10`, and the Objective text.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

## Suite 4: Edit Interview · TC-038 – TC-042

---

### TC-038 · P1
**Edit dialog opens and pre-populates all existing interview data.**

> **Precondition:** On the interview detail page for your test interview (created in TC-033).

- [ ] 1. Click the "Edit" button on the interview detail page (pencil icon, top-right area).
- [ ] 2. Confirm the Edit dialog opens.
- [ ] 3. Confirm all fields are pre-filled with the saved values: the Interview Name shows your interview name; the correct interviewer card is highlighted; Number of Questions shows `3`; Duration shows `10`; the Objective field shows the saved objective text.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-039 · P1
**Editing the interview name and saving shows a success toast and persists the change.**

> **Precondition:** Edit dialog is open (TC-038); Step 1 is showing.

- [ ] 1. Clear the Interview Name field and type your **Interview name** followed by ` (Edited)` (e.g., `QA Checklist Interview (Edited)`).
- [ ] 2. Click "Edit questions manually" (the Step 2 button in edit mode).
- [ ] 3. Without changing any question text, click "Save".
- [ ] 4. Wait for the "Interview updated successfully." toast to appear.
- [ ] 5. Confirm the detail page now shows the updated name.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** _(Interview name is now "[name] (Edited)" from here on)_ ___

---

### TC-040 · P1
**Edit Step 2 pre-populates all existing question texts.**

> **Precondition:** Edit dialog is open; on Step 1.

- [ ] 1. Click "Edit questions manually" to reach Step 2.
- [ ] 2. Confirm each question card's text field shows the previously saved question text (e.g., "Tell me about your background.", "Describe a challenging project.", "How do you handle deadlines?").

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-041 · P1
**"Back" in Edit Step 2 returns to Step 1 with the edited name preserved.**

> **Precondition:** In Edit dialog Step 2; the name was changed to "[name] (Edited)" in TC-039.

- [ ] 1. Click the "Back" button in Edit Step 2.
- [ ] 2. Confirm Step 1 of the edit dialog is shown.
- [ ] 3. Confirm the Interview Name field still shows the edited name (with "(Edited)" appended).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-042 · P2
**"✨ Regenerate questions" replaces question cards with AI-generated content.**

> **Pre-skipped** — Requires a live OpenAI API key. Re-enable when `OPENAI_API_KEY` is configured.

- [ ] 1. In Edit dialog Step 1 with all fields filled, click "✨ Regenerate questions".
- [ ] 2. Confirm an API request fires and Step 2 loads with newly generated question texts.

**Result:** ☑ SKIP   **Reason:** Requires live OpenAI API key   **Notes:** ___

---

## Suite 5: Interview Detail & Toggle · TC-043 – TC-051

---

### TC-043 · P1
**Interview detail page renders three stat cards: Total Candidates, Average Duration, Interview Completion Rate.**

> **Precondition:** Navigate to the detail page for your test interview.

- [ ] 1. Go to `/interviews/[Interview ID]` (or click the interview card from the dashboard).
- [ ] 2. Confirm three stat cards are visible: "Total Candidates" showing `0`, "Average Duration" showing `0m 00s`, and "Interview Completion Rate" showing `0%` (all zero for a new interview with no responses).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-044 · P1
**Breadcrumb shows "Interviews > [Interview Name]".**

- [ ] 1. On the interview detail page, look at the breadcrumb navigation near the top.
- [ ] 2. Confirm it shows "Interviews" (as a clickable link) followed by the current interview name (e.g., "[name] (Edited)" after TC-039).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-045 · P1
**Active toggle is present and in the checked (on) state for a newly active interview.**

- [ ] 1. On the detail page, locate the toggle switch near the top-right.
- [ ] 2. Confirm the label "Active" is shown next to it and the toggle is in the on/checked state.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-046 · P1
**Response table has all required columns.**

- [ ] 1. On the detail page, look at the response table's column headers.
- [ ] 2. Confirm all eight columns are present: **Name**, **Email**, **Overall Score**, **Communication**, **Date**, **Duration**, **Status**, **Details**.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-047 · P1
**"No responses to display" empty state appears when the interview has no responses.**

- [ ] 1. On the detail page for a newly created interview (no candidates yet), look at the table body.
- [ ] 2. Confirm the text "No responses to display" appears inside the table.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-048 · P1
**Toggling the interview to Inactive updates the label and shows a toast.**

> **Precondition:** Interview is currently Active (toggle is on).

- [ ] 1. Click the Active/Inactive toggle switch to turn it off.
- [ ] 2. Wait for the toast "The interview is now inactive." to appear (with title "Interview status updated").
- [ ] 3. Confirm the toggle label now reads "Inactive" and the switch is in the off/unchecked state.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-049 · P1
**Toggling the interview back to Active updates the label and shows a toast.**

> **Precondition:** Interview is currently Inactive (TC-048 completed).

- [ ] 1. Click the toggle switch again to turn it on.
- [ ] 2. Wait for the toast "The interview is now active." to appear.
- [ ] 3. Confirm the toggle label now reads "Active" and the switch is in the on/checked state.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-050 · P2
**Typing in the search field enables the Search button and reveals Clear/Reset buttons.**

- [ ] 1. On the detail page, find the search input in the response table area and type `test`.
- [ ] 2. Confirm the "Search" button becomes active (clickable).
- [ ] 3. Confirm "Clear" and "Reset" buttons appear.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-051 · P2
**Status filter dropdown shows all expected options.**

- [ ] 1. Click the Status filter dropdown (labelled "All" by default).
- [ ] 2. Confirm all five options are visible: **All**, **No Status**, **Not Selected**, **Potential**, **Selected**.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

## Suite 6: Candidate Response View · TC-052 – TC-060

> **All tests in this suite are pre-skipped.**
> Requires at least one completed interview response in the database for your test interview.
> Re-enable when a completed Retell AI call response exists and appears as a row in the detail page table.

---

### TC-052 · P1
**Clicking a response row opens the candidate detail dialog.**

> **Pre-skipped** — No interview responses available; requires a completed Retell call.

- [ ] 1. Click any row in the response table.
- [ ] 2. Confirm a candidate detail dialog opens.

**Result:** ☑ SKIP   **Reason:** No interview responses available (requires completed Retell call)   **Notes:** ___

---

### TC-053 · P1
**Response dialog shows candidate name, email, and overall score.**

> **Pre-skipped** — No interview responses available.

- [ ] 1. Open a response dialog (see TC-052).
- [ ] 2. Confirm the candidate's name, email address, and overall score are all displayed.

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

### TC-054 · P1
**Analytics section renders inside the response dialog.**

> **Pre-skipped** — No interview responses available.

- [ ] 1. Open a response dialog; find the analytics section.
- [ ] 2. Confirm Overall Score, Communication score, and other metrics are shown.

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

### TC-055 · P1
**Transcript section renders inside the response dialog.**

> **Pre-skipped** — No interview responses available.

- [ ] 1. Open a response dialog; scroll to the transcript section.
- [ ] 2. Confirm conversation turns (interviewer and candidate) are displayed.

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

### TC-056 · P2
**Question-by-question scores are shown in the response dialog.**

> **Pre-skipped** — No interview responses available; requires analyzed call data.

- [ ] 1. Open a response dialog with analysis data; locate per-question scores.
- [ ] 2. Confirm each question has an associated score displayed.

**Result:** ☑ SKIP   **Reason:** No interview responses available (requires analyzed call data)   **Notes:** ___

---

### TC-057 · P1
**Status dropdown in the response dialog changes the candidate's status.**

> **Pre-skipped** — No interview responses available.

- [ ] 1. Open a response dialog; find the candidate status dropdown.
- [ ] 2. Select "Potential".
- [ ] 3. Confirm the dropdown label updates to "Potential".

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

### TC-058 · P1
**Status change persists after a page reload.**

> **Pre-skipped** — No interview responses available; requires TC-057 first.

- [ ] 1. After TC-057, reload the page.
- [ ] 2. Confirm the response row still shows the "Potential" status badge.

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

### TC-059 · P1
**Response dialog can be closed.**

> **Pre-skipped** — No interview responses available.

- [ ] 1. Open a response dialog; click the X button or press Escape.
- [ ] 2. Confirm the dialog closes and the detail page is visible.

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

### TC-060 · P2
**Duration and date fields in the response dialog display correct data.**

> **Pre-skipped** — No interview responses available.

- [ ] 1. Open a response dialog; locate the Duration and Date fields.
- [ ] 2. Confirm Duration is shown in MM:SS format and Date is a recognizable date/time string.

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

## Suite 7: Delete Response · TC-061 – TC-063

> **All tests in this suite are pre-skipped.**
> Requires at least one response row in the detail table.
> Re-enable when at least one interview response exists for your test interview.

---

### TC-061 · P1
**Delete button on a response row opens a confirmation dialog.**

> **Pre-skipped** — No interview responses available.

- [ ] 1. Find a response row in the table and click its trash/delete icon.
- [ ] 2. Confirm a confirmation dialog opens asking you to confirm deletion.

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

### TC-062 · P1
**Cancel on the delete confirmation dialog closes it without deleting anything.**

> **Pre-skipped** — No interview responses available; requires TC-061.

- [ ] 1. Open the delete confirmation dialog (TC-061); click "Cancel".
- [ ] 2. Confirm the dialog closes and the response row is still present in the table.

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

### TC-063 · P1
**Confirming deletion removes the response row from the table.**

> **Pre-skipped** — No interview responses available; requires TC-061.

- [ ] 1. Open the delete confirmation dialog (TC-061); click "Confirm" (or "Delete").
- [ ] 2. Confirm the dialog closes and the response row is no longer in the table.

**Result:** ☑ SKIP   **Reason:** No interview responses available   **Notes:** ___

---

## Suite 8: Pre-Call Screen · TC-064 – TC-072

---

### TC-064 · P0
**Pre-call screen renders all elements: greeting, interview info, avatar, checklist, candidate form, and footer.**

> **Precondition:** Your test interview is Active and its Interview ID is recorded in Config.

- [ ] 1. Go to `/call/[Interview ID]` in your browser.
- [ ] 2. Confirm the following are all visible:
  - Heading "👋 Ready to Start Your Interview?"
  - The interview name
  - A duration label (e.g., "10 min or less") with a clock icon
  - The AI interviewer's avatar image
  - Before-We-Begin badges: "🎤 Make sure your mic is on", "🎧 Sit in a quiet space", "🔴 Tab switching will be recorded"
  - First Name input field
  - Last Name input field
  - Email input field
  - An "I'm Ready" submit button
  - An "Exit" button
  - Footer text "Powered by OpenHire"
- [ ] 3. Open DevTools Console (F12) — confirm no red error messages.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-065 · P0
**"I'm Ready" button is disabled when the form is empty.**

- [ ] 1. Load `/call/[Interview ID]` fresh (or clear all fields).
- [ ] 2. Without typing anything, confirm the "I'm Ready" button is grayed out and cannot be clicked.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-066 · P0
**Invalid email format shows "Please enter a valid email" under the field.**

- [ ] 1. On the pre-call screen, type `notanemail` into the Email field.
- [ ] 2. Press Tab or click elsewhere to move focus away.
- [ ] 3. Confirm the error "Please enter a valid email" appears below the Email field.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-067 · P0
**Leaving name fields empty keeps "I'm Ready" disabled even with a valid email.**

- [ ] 1. On the pre-call screen, type `qa@example.com` into the Email field; leave First Name and Last Name empty.
- [ ] 2. Confirm the "I'm Ready" button remains grayed out.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-068 · P0
**"I'm Ready" button becomes enabled when all three fields have valid values.**

- [ ] 1. Fill in First Name (e.g., `QA`), Last Name (e.g., `Tester`), and Email (e.g., `qa@example.com`).
- [ ] 2. Confirm no validation errors appear under any field.
- [ ] 3. Confirm the "I'm Ready" button is now active and clickable.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-069 · P0
**"Exit" button opens an "Are you sure?" confirmation dialog.**

- [ ] 1. On the pre-call screen, click the "Exit" button.
- [ ] 2. Confirm a dialog appears with the text "Are you sure you want to exit the interview?" and two buttons: "Cancel" and "Continue".

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-070 · P0
**Clicking "Cancel" in the exit dialog dismisses it and preserves form values.**

> **Precondition:** Exit dialog is open (TC-069); the form fields had values before opening the dialog.

- [ ] 1. Click "Cancel" in the exit confirmation dialog.
- [ ] 2. Confirm the dialog closes and the pre-call screen is visible.
- [ ] 3. Confirm the First Name, Last Name, and Email fields still contain the values you entered before.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-071 · P0
**Clicking "Continue" in the exit dialog transitions to the ended/thank-you screen.**

- [ ] 1. Click "Exit" to open the confirmation dialog.
- [ ] 2. Click "Continue" in the dialog.
- [ ] 3. Confirm the screen changes to show: heading "Thank you very much for considering." and sub-text "You can close this tab now."

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-072 · P0
**Navigating to an invalid/non-existent interview call URL shows an error page.**

- [ ] 1. Go to `/call/invalid-interview-id-xyz` in your browser.
- [ ] 2. Confirm an "Invalid URL" error message or illustration is displayed — the normal pre-call screen is not shown.
- [ ] 3. Open DevTools Console (F12) — confirm no unhandled JavaScript errors appear.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

## Suite 9: Active Call · TC-073 – TC-077

> **All tests in this suite are pre-skipped.**
> Requires a live Retell AI API key and an active call session.
> Re-enable when `RETELL_API_KEY` is set and the Retell service is reachable.

---

### TC-073 · P0
**Active call screen renders with interviewer avatar and real-time transcript area.**

> **Pre-skipped** — Requires live Retell AI API key.

- [ ] 1. Complete the pre-call form and click "I'm Ready"; grant microphone permission when prompted.
- [ ] 2. Confirm the active call screen shows the interviewer avatar image and a live transcript/conversation area.

**Result:** ☑ SKIP   **Reason:** Requires live Retell AI API key   **Notes:** ___

---

### TC-074 · P1
**Progress bar advances over the call duration.**

> **Pre-skipped** — Active call requires Retell API key.

- [ ] 1. During an active call, observe the progress bar.
- [ ] 2. Confirm it visually advances as elapsed time increases.

**Result:** ☑ SKIP   **Reason:** Requires live Retell AI API key   **Notes:** ___

---

### TC-075 · P1
**Remaining time countdown is visible during an active call.**

> **Pre-skipped** — Active call requires Retell API key.

- [ ] 1. During an active call, look for a countdown timer on screen.
- [ ] 2. Confirm a remaining-time countdown is visible.

**Result:** ☑ SKIP   **Reason:** Requires live Retell AI API key   **Notes:** ___

---

### TC-076 · P1
**A warning banner appears when the user switches browser tabs during an active call.**

> **Pre-skipped** — Active call requires Retell API key.

- [ ] 1. During an active call, switch to another browser tab and then switch back.
- [ ] 2. Confirm a warning banner appears on the call screen noting that the tab switch was recorded.

**Result:** ☑ SKIP   **Reason:** Requires live Retell AI API key   **Notes:** ___

---

### TC-077 · P0
**"End Interview" button transitions from the active call to the ended screen.**

> **Pre-skipped** — Active call requires Retell API key.

- [ ] 1. During an active call, click the "End Interview" button.
- [ ] 2. Confirm the call ends and the screen transitions to the ended/thank-you screen.

**Result:** ☑ SKIP   **Reason:** Requires live Retell AI API key   **Notes:** ___

---

## Suite 10: Ended Screen & Feedback · TC-078 – TC-085

---

### TC-078 · P0
**Ended screen shows the correct "Thank you" message when exiting from the pre-call screen.**

> **Precondition:** Interview is Active; navigate to the pre-call screen.

- [ ] 1. Go to `/call/[Interview ID]`.
- [ ] 2. Click "Exit", then click "Continue" in the confirmation dialog.
- [ ] 3. Confirm the screen shows: heading "Thank you very much for considering." and sub-text "You can close this tab now."

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-079 · P1
**"Provide Feedback" button opens the feedback dialog.**

> **Precondition:** On the ended screen (TC-078 or TC-071 completed).

- [ ] 1. Click the "Provide Feedback" button.
- [ ] 2. Confirm a dialog opens with the heading "Share your experience".
- [ ] 3. Confirm the dialog contains three satisfaction emoji buttons (😀 "Great", 😐 "Okay", 😔 "Poor"), a text area for written feedback, and a "Submit Feedback" button.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-080 · P1
**"Okay" (😐) emoji is pre-selected by default when the feedback dialog opens.**

> **Precondition:** Feedback dialog is open; no emoji has been clicked yet.

- [ ] 1. Immediately after the feedback dialog opens (before clicking anything), look at the three emoji buttons.
- [ ] 2. Confirm the "😐 Okay" button appears selected/highlighted and the other two ("😀 Great", "😔 Poor") do not.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-081 · P1
**Clicking "Great" selects it and deselects the previously selected "Okay".**

> **Precondition:** Feedback dialog open; "Okay" is currently selected.

- [ ] 1. Click the "😀 Great" emoji button.
- [ ] 2. Confirm "Great" is now highlighted/selected.
- [ ] 3. Confirm "Okay" is no longer highlighted.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-082 · P0
**Submitting the feedback form shows a "Thank you for your feedback!" toast.**

> **Precondition:** Feedback dialog open; a satisfaction emoji is selected (the default "Okay" is sufficient).

- [ ] 1. Without changing anything (or with "Okay" pre-selected), click "Submit Feedback".
- [ ] 2. Wait for the toast "Thank you for your feedback!" to appear.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-083 · P1
**Feedback dialog closes automatically after successful submission.**

> **Precondition:** TC-082 completed (feedback submitted; success toast shown).

- [ ] 1. After the success toast from TC-082 appears, confirm the feedback dialog is no longer visible.
- [ ] 2. Confirm the ended screen is visible in the background.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-084 · P1
**"Provide Feedback" button disappears from the ended screen after successful submission.**

> **Precondition:** TC-082 completed.

- [ ] 1. On the ended screen (after the feedback dialog closed), look for the "Provide Feedback" button.
- [ ] 2. Confirm the button is no longer visible anywhere on the page.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-085 · P2
**"Submit Feedback" button is enabled immediately when the dialog opens (Okay pre-selected = valid).**

> **Precondition:** A fresh feedback dialog is open (reload the page → exit pre-call → open feedback dialog); no emoji has been clicked.

- [ ] 1. Open the feedback dialog by clicking "Provide Feedback"; do not click any emoji button.
- [ ] 2. Confirm the "Submit Feedback" button is already active and clickable (not grayed out) because "Okay" is pre-selected by default.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

## Suite 11: Ineligible Screen · TC-086 – TC-087

> **All tests in this suite are pre-skipped.**
> TC-086 requires a prior completed Retell call to register a candidate email in responses.
> TC-087 requires an interview configured with a respondents whitelist.
> Re-enable when either condition can be met.

---

### TC-086 · P1
**Submitting the pre-call form with a duplicate email shows the ineligible screen.**

> **Pre-skipped** — Requires a prior completed Retell call to have registered a candidate email.

- [ ] 1. Go to `/call/[Interview ID]`; fill the form with the same email used in a previous completed call; click "I'm Ready".
- [ ] 2. Confirm the ineligible screen is shown instead of the active call screen.

**Result:** ☑ SKIP   **Reason:** Requires a completed Retell call response in the database   **Notes:** ___

---

### TC-087 · P1
**Submitting with an email not on the whitelist shows the ineligible screen.**

> **Pre-skipped** — Requires an interview configured with a respondents whitelist.

- [ ] 1. Go to the call URL for a whitelist-configured interview; fill the form with an email not on the whitelist; click "I'm Ready".
- [ ] 2. Confirm the ineligible screen is shown.

**Result:** ☑ SKIP   **Reason:** Requires an interview configured with a respondents whitelist   **Notes:** ___

---

## Suite 12: Edge Cases · TC-088 – TC-095

---

### TC-088 · P1
**"Interviews" breadcrumb on the detail page navigates back to the dashboard.**

> **Precondition:** On the interview detail page.

- [ ] 1. Click the "Interviews" link in the breadcrumb (the first crumb, shown as a link).
- [ ] 2. Confirm the browser navigates to `/` (the dashboard).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-089 · P1
**Navigating to a call URL with a non-existent interview ID shows the "Invalid URL" error page.**

- [ ] 1. Go to `/call/invalid-interview-id-xyz` in your browser.
- [ ] 2. Confirm the "Invalid URL" error page is displayed (same behaviour as TC-072).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-090 · P1
**Navigating to the call URL of an inactive interview shows "Interview Is Unavailable".**

> **Precondition:** Your test interview is currently Active.

- [ ] 1. On the detail page, click the toggle switch to set the interview to Inactive; confirm the "Inactive" toast appears.
- [ ] 2. Go to `/call/[Interview ID]` in your browser.
- [ ] 3. Confirm "Interview Is Unavailable" (or a closed/unavailable illustration) is displayed — the pre-call form is not shown.
- [ ] 4. Go back to the detail page and toggle the interview back to Active (to avoid blocking later tests).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** _(Remember to re-activate the interview in step 4!)_ ___

---

### TC-091 · P1
**User session persists across a hard page refresh.**

> **Precondition:** Logged in; on the dashboard or interview detail page.

- [ ] 1. Navigate to `/interviews/[Interview ID]` — the detail page should load and you should be authenticated.
- [ ] 2. Hard-reload the page (press Ctrl+Shift+R or Cmd+Shift+R on Mac).
- [ ] 3. Confirm the detail page content is still visible and your name/email still appear in the sidebar — you were **not** redirected to `/sign-in`.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-092 · P2
**Interview card on the dashboard shows the correct Active (green) or Inactive (grey) badge.**

> **Precondition:** On the dashboard; your test interview is Active.

- [ ] 1. Look at the interview card for your test interview on the dashboard.
- [ ] 2. Confirm it shows a green "Active" badge.
- [ ] 3. Go to the detail page, toggle the interview to Inactive, then return to the dashboard.
- [ ] 4. Confirm the same interview card now shows a grey "Inactive" badge.
- [ ] 5. Go back to the detail page and toggle the interview back to Active for subsequent tests.

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-093 · P2
**Pre-call screen for an anonymous interview hides name/email fields and enables "I'm Ready" immediately.**

> **Pre-skipped** — Requires creating a separate anonymous interview (one with "Anonymous responses?" toggled ON). Re-enable when such an interview exists.

- [ ] 1. Navigate to the call URL for an anonymous interview.
- [ ] 2. Confirm the First Name, Last Name, and Email fields are **not** present on the pre-call screen.
- [ ] 3. Confirm the "I'm Ready" button is **already enabled** without filling any fields.

**Result:** ☑ SKIP   **Reason:** Requires a separate anonymous interview to be created   **Notes:** ___

---

### TC-094 · P2
**Browser page title on the interview detail page includes the interview name.**

> **Precondition:** On the interview detail page.

- [ ] 1. Look at the browser tab title.
- [ ] 2. Confirm the title includes the current interview name (e.g., "[name] (Edited)" after TC-039).

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

### TC-095 · P1
**No unhandled JavaScript errors appear during normal navigation across the full happy path.**

> **Precondition:** Run this test last, after completing all other non-skipped tests.

- [ ] 1. Navigate through the full happy path in order: `/sign-in` → login → dashboard → interview detail → `/call/[Interview ID]` (pre-call screen) → exit to ended screen. All pages should load without crashing.
- [ ] 2. Open browser DevTools (F12 → Console tab) and look for any red **error** messages (type `error`, not `warn`).
- [ ] 3. Confirm no unhandled JavaScript errors are present. *(A known accessibility warning about the dialog — BUG-001 — is a `warn` level message, not an `error`, and does not fail this test.)*

**Result:** ☐ PASS  ☐ FAIL  ☐ SKIP   **Notes:** ___

---

## Run Summary

*Fill in after completing the run.*

| Suite | Total | PASS | FAIL | SKIP | Notes |
|-------|-------|------|------|------|-------|
| 1: Authentication | 14 | | | | |
| 2: Dashboard | 6 | | | | |
| 3: Create Interview | 17 | | | | |
| 4: Edit Interview | 5 | | | | |
| 5: Interview Detail & Toggle | 9 | | | | |
| 6: Candidate Response View | 9 | | | | |
| 7: Delete Response | 3 | | | | |
| 8: Pre-Call Screen | 9 | | | | |
| 9: Active Call | 5 | | | | |
| 10: Ended Screen & Feedback | 8 | | | | |
| 11: Ineligible Screen | 2 | | | | |
| 12: Edge Cases | 8 | | | | |
| **TOTAL** | **95** | | | | |

**Pass Rate (executed):** ___/___ = ___%
**Overall Coverage:** ___/95 = ___%
