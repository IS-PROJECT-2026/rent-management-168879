1. Student Details
Full Name: MUHEREZA CASPER
GitHub Username: caspermuhereza
Email: casper.muhereza@strathmore.edu

2. Deployed Project Link
Live GitHub Pages URL: https://is-project-2026.github.io/rent-management-168879/ 

A. Your Best Commit
Use this one you just did - it's perfect conventional commits:

A. Your Best Commit


Commit URL: https://github.com/IS-PROJECT-2026/rent-management-168879/commit/40c6097990057b003407c1f0588fadc9d3eea26d

Why: Type feat: is correct for new feature, subject is imperative and describes WHAT and WHY (deploy wwwroot via Actions for Pages), and it creates a single concern artifact .github/workflows/deploy.yml

B. A Mistake or Struggle



Link: https://github.com/IS-PROJECT-2026/rent-management-168879/actions/runs/32061497735-> click the red Deploy wwwroot to GitHub Pages #1 run that failed with Get Pages site failed
What happened: First Pages deploy failed with HttpError Not Found - Get Pages site failed. I had set Source to GitHub Actions but configure-pages needed enablement:true. I fixed it in commit fix: enable Pages via configure-pages enablement and re-pushed to main, which turned green.

C. PR You're Proud Of

PR URL: https://github.com/IS-PROJECT-2026/rent-management-168879/pull/12 - this is the Merge pull request #12 from IS-PROJECT-2026/feat/pages-wwwroot-action 

D. One Thing Differently

What: I would create .github/workflows/deploy.yml and set Pages source to GitHub Actions on Day 1, not at the end. Late setup caused failed deployment and caching issues.

A. Milestones and Issues
<img width="1485" height="729" alt="image" src="https://github.com/user-attachments/assets/c8638fd8-9838-4572-bf57-01f01682786b" />

Caption: Milestone v1.0 with 3 issues linked - API deployment, Pages action, and frontend loader fix

B. Project Board
C. Branching Architecture
<img width="1030" height="626" alt="image" src="https://github.com/user-attachments/assets/2f1f5666-47be-47ef-a448-5016cb17d43e" />

D. Pull Requests & Traceability


<img width="1886" height="974" alt="image" src="https://github.com/user-attachments/assets/d83e8967-5a59-44b4-840e-2da74283f97c" />


5. Merge Conflict Evidence
Conflict 1 — Full Chronology
What cause did you use? Same line edited concurrently - both branches edited the same JSON key in server/tenants.json

Step 1: Generating the Clash


Code
D:\...\gitassignment> git checkout main
D:\...\gitassignment> git merge feat/conflict-same-line
Auto-merging server/tenants.json
CONFLICT (content): Merge conflict in server/tenants.json
Automatic merge failed; fix conflicts and then commit the result.


Caption: Branch feat/conflict-same-line and main both edited rentBalance for same tenant on same line - Git stopped merge with CONFLICT warning

Step 2: Inside the Code Editor (Conflict Markers)




Code
<<<<<<< HEAD
"rentBalance": 3000

"rentBalance": 0
>>>>>>> feat/conflict-same-line
Caption: Raw conflict markers in tenants.json - HEAD has 3000, incoming branch has 0. Chose 0 as correct because payment logic clears balance.

Step 3: Resolution & Clean Merge



After fix:

Bash
git add server/tenants.json
git commit -m "fix: resolve merge conflict in tenants.json - keep paid balance"
git push origin main
Caption: Resolved conflict by keeping correct balance, committed fix: resolve merge conflict, history now shows clean merge commit on main

Evidence Link: https://github.com/IS-PROJECT-2026/rent-management-168879/commit/<paste your resolve commit SHA here> + https://github.com/IS-PROJECT-2026/rent-management-168879/blob/main/server/tenants.json

Conflict 2 — Different Cause
What cause did you use? Add/Add conflict - identical filename added in two branches with different content

Why does this cause trigger a conflict? When two independent branches both create a new untracked file with same path but different content, Git has no common ancestor to merge, so it marks file as both added with CONFLICT (add/add).



This is your conflict-add.txt:

Code
<<<<<<< HEAD
This is version from main branch

This is version from feat/add-conflict branch
>>>>>>> feat/add-conflict
Caption: Add/Add conflict between main and feat/add-conflict both adding conflict-add.txt - resolved by keeping combined version

Evidence: https://github.com/IS-PROJECT-2026/rent-management-168879/blob/main/conflict-add.txt

Conflict 3 — Different Cause
What cause did you use? Delete/Modify conflict - one branch deletes file while other modifies it

Why does this cause trigger a conflict? Git cannot decide whether to keep deletion or keep modifications. If branch A deletes conflict-demo.txt and branch B edits same file, Git stops and asks CONFLICT (modify/delete) because applying deletion would lose B's changes.



Your terminal:

Code
CONFLICT (modify/delete): conflict-demo.txt deleted in feat/delete-demo and modified in HEAD. Version HEAD of conflict-demo.txt left in tree.
Caption: Modify/Delete conflict between feat/delete-demo (deleted file) and feat/modify-demo (edited file) - resolved by keeping modified version and re-adding file

Evidence: https://github.com/IS-PROJECT-2026/rent-management-168879/blob/main/conflict-demo.txt

