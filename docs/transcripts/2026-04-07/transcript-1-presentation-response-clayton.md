# Clayton's Response to Presentation Walkthrough

> **Date:** 2026-04-07
> **Participants:** Clayton (solo recording while watching Nourin's presentation video)
> **Duration:** ~18:30
> **Format:** Loom/video response — Clayton recorded reactions while watching
> **Context:** Response to `docs/presentation-operating-system.html` walkthrough

---

## Transcript

00:00 Hey Noreen, so I'm just going to record while I'm watching the video, so I can just leave feedback. So, The first question you had was, should we auto-assign team members to the client's Slack channel?

00:11 So, uhm, We can, if there's a way that we can, like, select, I don't know, I feel like it might get a little complicated, like, this is where I'm running into the issue of the auto-assign, so just, just so you can kind of see, uh, what I'm, I'm talking about, uhm, like where the scenarios break is basically

00:40 like, let's say you do it in a couple different ways. Number one, you, Whenever the clients like added in the slack channels created, you add like me and then you add like Andrew, for example, right?

00:56 So then it becomes like, this is fine, we're always added to a channel, but the other members that need to be added, the strategist and the manager, and maybe when we add the junior strategist, the junior strategist, right?

01:07 So there's maybe like three people added here. If we're going to add all those people, we have to know like what pod it's a part of.

01:17 So like we could assign like that clients to like pod three, for example, and it would know what strategist, what junior strategist and what manager to assign.

01:27 Now, what happens if a member leaves, for example, let's say the The strategist of pod three is no longer there.

01:36 And we added a new member that is the strategist for pod three, right? So that would need to be in the app of like some way of like keeping record or keeping that like record and up to date.

01:49 And, um, so that way, anytime a client is added, it's done. And so you kind of have to make the automation, not team member specific, but user specific based on the pod.

02:01 And anytime a user is added or removed from the app, we need to make sure like their pod number and status is added, right?

02:09 That's where the complication comes. So if you think all of doing that is worth it to automate adding the slack, then that's, or assigning a member to slack, then that's fine.

02:20 Or it just takes us mainly doing it, right? Um, and so that's where I would look at it. But every time we add someone, a strategist and a manager at bare minimum will be added.

02:32 When we add in a junior strategist, a junior strategist will be added and we can assign them in the app, their role and the pod number that they're a part of.

02:40 And so you could technically do it that way where it would work. So that's the only way I can see where it worked because you have to make it independent of like, you can't be like, anytime this is created, add this member.

02:53 You can only do that with me and Andrew because we're universal members. It doesn't matter what happens. We'll never be gone or whatever.

03:00 Um, you can't do that with all the other members. So maybe that's what you were thinking and just giving you my thoughts.

03:07 We should auto send a welcome message to the client with their dashboard login with via the Slack channel. Yeah, I agree with that.

03:13 I think you can do that. I think it comes down to, um, uh, the welcome message. We'll just have to figure out right now we're using Slack and sending a welcome message with like their Google drive link.

03:24 And we're sending it or the Dropbox link. We're sending their like a video on how to record Loom video, their thumbnails, how to upload their footage, like how to just all these things.

03:34 But ideally what you do in Slack is you just send to say like, Hey, just so you know, like Slack is for communication.

03:41 We also have an internal app. Here's your login and you can access the link here. And like all this stuff we were previously sending a message on is like internally in the app somewhere, like easy for them to navigate.

03:51 So that was like my thinking process around it. Um, so that would be like my first, uh, answer to like those two questions, but I'll keep watching.

04:00 Alright. Okay, so, basically, uhm, I'd say, yeah, the client, the client, like, dashboard side, like, having a client, like, login, for example, I think is really helpful, and I'm totally fine to build that alongside of it, uhm, seems like you're already, like, thinking ahead, which, if you think it's worth building it alongside the v1, then I'm totally fine. I had already built one, uhm, it wasn't fantastic, uhm, to be honest, but I can try to show you just really quickly.

04:29 Give me one second. So, here was my, uh, like, client portal example. Again, I'm not saying you need to do it this way, I'm just giving you an example.

04:40 So, I just logged in as a client, right, so I could see, like, my calendar, uhm, this is all extra, like, work that was done, I don't think we need to do it in this example.

04:48 Exact same way, but I had built it to where, like, the client knows what all their strategy calls are, and they know when they're getting, like, scripts and filming, and so they can just, like, see this calendar chart, uhm, and so I had done that because in the app that I had built when I was using Base44

05:06 was that strategists could actually schedule calls for the, the client through this app, you know. We can do that later, it's not a big issue, I'm just showing you what I had, so you can somewhat see it.

05:17 We had, like, a dashboard, so they could see, like, the script, what's in script writing, what's ready for them to record, what's uploaded, what's in editing, what are we finalizing, and then what's posted.

05:26 Again, this is just a very basic, like, list of things. We had, like, an onboarding info tab, which I was trying to build out as, like, a resources hub or something.

05:36 Where we could, like, record a lot of trainings and make it really inform, uh, interesting. Then we had, like, the idea of connecting channel performance, but that's, again, all this stuff is later stuff, it's not V1 stuff, like, in my opinion.

05:46 I think maybe something like a dashboard, again, this is not the style or look, this is just an example where they can come in and upload footage.

05:54 Like, everything they need as we start figuring out is, like, here. And then we had, like, the onboarding information, or, like, tips, or lessons, or things that we get asked, you know, frequently asked questions, things like that, uhm, I thought was helpful.

06:07 So, I'm just giving you my thoughts there on that, uhm, but I do think that having some kind of onboarding there is, uh, pretty helpful.

06:17 I think you had also asked me to review these stages. Let me through it and let me know if any tabs.

06:23 So writer clicks. Create scripts, uhm, capture script, started times, uh, creator, create script, Google doc is auto-created and named and linked to the project.

06:38 Oh, that would be amazing. Um, the client uploads the footage. So. Let me see here. What's the status of my video?

06:53 And after onboarding here is how is video most. Okay. Yeah. So writer clicks, create scripts, Google doc auto-created name, link to project.

07:02 That's all fine. Um, where what's interesting here is that, um, which I don't know if you mean this, but there's a stage in between this, which is like the, obviously the senior editor, or senior writer will review the script.

07:15 So they will actually like watch, you know, the, the script, they have a little bit of like a checklist that they kind of like, they kind of use a checklist to determine like, did it pass the V1?

07:32 And that's what they use to track like the KPIs. So like, we also have a list of all the KPIs.

07:36 KPIs that the, uh, the writers are responsible, the senior writers are responsible for the writing department. You know, we have like KPIs for the writers, KPIs for the senior writers, and then we have like number for the writing department.

07:50 And so like, we want to be able to have like individual KPIs, you know, things like that. So like, um, once a script is written, it goes to review.

08:00 And then once it's reviewed, um, it goes back to being fixed by the writer. And then once it's fixed, it's, uh, sent to the client.

08:11 So we have to have like a, this was sent to the client, but I guess if you're building in the app, they would be able to see it clearly or get like notified or something like that.

08:19 Um, because we want them to record. Whenever they are done with the video, they can just upload it again. Right now we're waiting on them to like message us in Slack, or we have like an automation in the Dropbox or whatever that notifies the team that a client has uploaded.

08:33 Um, so that's when maybe we could do it. Once the footage is uploaded, we might start to, the editor has to choose to start the, the, uh, the project.

08:44 Cause let's say there's like, I don't know, let's say that they have like three clients. Clients, for example, and all three clients have two videos uploaded, right.

08:55 Um, in the queue and they need to get three videos out this week. So they may work on these three to get done by the week, but these three are like, not, they won't start until the following week.

09:07 So we may have like, some people have queues or like a long list of footage that we have, um, and then the Senior Editor and the YouTube Manager are notified, uhm, hmm, yeah, Editor submits V1.

09:30 The YouTube Manager is They don't technically need to be notified, but it's good that they're notified, I think that's fine.

09:37 The Senior Editor definitely needs to be notified because they need to be able to review the project quickly and get it done.

09:42 If there's any other review that's not completed, like, again, the Senior Editor has, like, a checklist and they're trying to, like, see how good was V1 so they can track, like, is our V1 on standard.

09:53 Once that's completed, then you basically have the edited file. The Editor will fix the feedback, so there's, like, a fixed feedback kind of stage.

10:05 Uhm, I guess you have, like, an internal review, uh, here. Okay, so this is a notification, then they review it.

10:17 Yeah, and then there's usually, like, another fixed stage. The Editor that submitted it has to fix it. Once it's fixed, we then need to notify the YouTube Manager that it has been completed, so that they can send it to the Client.

10:27 The Client needs a way to, you know, leave their submission, and we have it tracked or notified or something like that to the Manager and the Editor, so that they can do the revisions.

10:42 And once they're, you know, done with the revisions, we need a way to get notified so that it's ready to be published and scheduled, right?

10:49 And then, while all this is happening in the editing process, we still have the thumbnail side of the process, right?

10:57 So, yeah, just giving you, filling in. Okay, let me pause here. Yeah, so, KPIs look great. I know there's a ton of stuff we can track.

11:07 There's obviously a lot more than this that we'll have to figure out. We'll probably just have to break down. By department, like, what we want to track, uhm, but, like, for writers, for example, if they click create a script, that wouldn't timestamp, uhm, that would maybe timestamp, like, the start date of the script, but it wouldn't compare it against the, if it was on time. They would have to do that when they clicked, like, finish script, or, like, script submitted, or something like that.

11:37 You Right? So that, that would track that KPI. But I get what you're saying. Uhm, editor clicks submit, edit, and app, uhm, yeah, exactly the same thing like that.

11:47 Submit, edit, uhm, charges, logs, the call, yeah. So we just have to go through, like, all the KPIs for each department, so that, you know, like, what are we tracking specifically for writers?

11:58 What are we tracking for editors? What might we want to track for clients? What might we want to track for, uh, YouTube managers and the strategists?

12:08 And then all those, like, KPIs basically boil up into, like, the company numbers and things like that, which I think you get the point.

12:16 So, yeah, totally understand. Hey, Noreen, uhm, fantastic. I was looking through this right here. Totally correct. What I would like to do in this process, whenever we're getting ready to launch V1, my favorite thing to do and this might be a little bit time-consuming, but is with you and Paulo to navigate how you can get everybody, uh, grouped to get this process completed. So, for example, if your goal is to go for the script writing side, right, the writing side, what I would want you to do is I would want you to take our top writer and, uhm, and then our senior writers.

12:48 So our two senior writers are Rafael and Vivian, uhm, and you can message them or have Paulo message them, right, to coordinate this, whatever.

12:59 I'll let you handle what you think is best, but it would be something like messaging Vivian and Rafael and saying, hey, I'm working on building the app.

13:06 I want your take on one of the processes. Uhm, here is a 15-minute slot I'd like to book. Can you all soon.

13:13 Bring your top writer, um, top one or two writers on the call so that we can review this before we finish the version one.

13:21 And so they can come in and they can give you their input and their thoughts. Again, you're from a project management standpoint thinking, how can we reduce these things?

13:30 They're just trying to give you what they currently do and what's in the process, right? So they're coming at you just so you get the information.

13:35 You're filtering that to reduce. Right, obviously I trust you on that, uhm, but that would be my approach, is you would just go with, say, hey Paulo, we need to schedule this time, uhm, and Paulo can help coordinate that, and then you would just get, like, a 15-minute block with the senior writers and the writer, you'd get a 15-minute block with the senior editors and the editor, you'd get a 15-minute block with the senior designer and designer, and so forth, right?

13:58 And so you would just go through and probably batch Thank you 5-6 calls back-to-back, or maybe you don't want to do it all at one time, you can space them out, however you want to do it, I don't care, uhm, and that way you get all the information, because I'm going to give you information, but they still do it on a day-to-day level, so they may have some, like, super minor, specific things that I'm not thinking of, right?

14:18 Uhm, so that would just be my take on that. Noreen, this right here is a fantastic idea about the archiving, I totally agree, uhm, the biggest thing is that sometimes clients will leave and just want to know and get access to all their footage, right?

14:34 So they, we do need some way of storing archive projects, it's also great for us to train on and, and build, eventually, I think, as we get into, like, more AI stuff around video edits and scripts and things like that, like, the amount of volume that we do so specific to real estate, I think it's, it's, at some point, will help us build either some large dataset or some training model or something off of it, and so I do think, like, archiving videos, having old scripts, having old, like, all these things at some point ends up becoming valuable, uhm, and so that's, but I totally agree that we can be kind of, like, archiving a lot of this stuff, uhm, so that we're not, like, eating up storage, uhm, so 100% agree, yeah, great idea.

15:14 Okay, sweet, I also just watched your, uh, your plan here, uhm, totally fine with that, the only thing that I would just caution you on is right here, login roles, client records, team assignments, 80 row clients, 35 team members, migrate from Notion, so, one thing that we have to do, Noreen, which I know is really annoying, but, like, with this app, as we look at getting it sorted, we just have to make sure the data is clean, that it's based off of, or a lot of things are gonna be kind of messed up, and so I know you, you mentioned give us access, but, like, we have, when you say 80 clients, we have to look at, like, which of those clients are actually active or not active, which are, they're, like, actual clients of ours versus, like, our own YouTube channel, because if you and you go to Known, you may see, like, Breaking and Building Leaders, Known Local, you may see, like, Ella, which has, like, a couple people here that are doing email with us, then we have Pod 1 of all the clients, uh, Pod 2 of all the clients, Pod 3 of all the clients, right, and so, then we also have Archive Clients, so, if we pulled those or not, so just keeping in mind we need that data to be clean on, like, what is actually our YouTube clients that we're working with.

16:23 You The other part I would say to look at is 35 team members, that seems a bit low.

16:31 We have, like, probably closer to 60 or 70, but some of them could be people that have left or people that are not active in Notion anymore or Slack anymore, and so we just have to really make sure, like, we have all the members, like, listed correctly, and then when someone actually leaves, we off-board them correctly and whatnot. Again, this is maybe later type of situations, but just making sure that you understand that we need the data to be quite clean and we need to really fine-tune the data and information we're putting in so that, like, from the start, we're getting as close to it as possible.

17:07 And so I know you're doing a lot of the strings through automation and AI and downloading, you know, probably some of the stuff, client records, roles, and you know, et cetera, et cetera.

17:15 It's just some of those things are based off of old things. So that's the only thing I would just say.

17:19 Other than that, what I would just love to know is, roughly speaking, based on these four things and kind of what we're talking about, what would you say is, like, the projected deadline?

17:28 I'm not looking for something, like, crazy. Uhm, I just, I want to be realistic, too. I want to push a little bit, but I want to be realistic as well.

17:35 Uhm, first and foremost, I think you're doing an amazing job. Thank you for thinking. Through this, I love that you're, like, you know, actually going above and beyond to, like, think of better ways to improve it.

17:44 You're thinking of archiving the folders or you did research on the cost of things. Like, I just really like that you're doing that.

17:51 I really appreciate that as well. Noreen shows that you're really, you care about this, and I really appreciate that. And just so you know, like, we're always looking for.

18:02 Uh, people in these roles in the future. So, um, yeah, we're just, I loved, I was really excited to see, like, a project and work on it with you and, um, and Paulo.

18:11 I know he was super excited about it as well, um, to be able to kind of build this and have both of you guys work on it.

18:17 And Paul is going to give a ton of information, I think, over time and help a lot with, um, what you're building out as well.

18:23 So just keep that in mind. He's a great resource to, to go back to. But, um, yeah, if you have any questions, just let me know.

18:29 Sorry this video went so long. You can watch it in 1.5 or 2x speed. But, um, yeah, if you have any questions for me, just let me know.

---

## Key Decisions Made

| Topic | Decision | Timestamp |
|-------|----------|-----------|
| Auto-add team to Slack | Conditional yes — must be pod-based, not hardcoded per member. Clayton + Andrew always. Strategist + Manager + Jr Strategist via pod lookup. | 00:00-03:00 |
| Auto-send welcome message | Yes — simplified to "Slack is for communication, here's your app login, everything is in the app" | 03:07-03:51 |
| Client dashboard in V1 | Yes — "totally fine to build alongside" | 04:00-04:16 |
| Archiving old projects | Yes — "fantastic idea, 100% agree" — also sees AI training data value | 14:18-15:14 |
| Build order | "Totally fine with that" | 15:14 |
| Department review calls before V1 | Yes — 15-min slots with senior + top IC per department | 12:16-14:12 |

## New Information Revealed

1. **Senior writers:** Rafael and Vivian (named for first time)
2. **Team count:** Closer to 60-70, not 35 — Notion export was incomplete
3. **Internal/non-client entries:** Breaking and Building Leaders, Known Local, Ella are NOT regular YouTube clients
4. **Senior writer script review stage** missing from current flow — they use a V1 quality checklist that feeds KPIs
5. **Writer fix-feedback loop** after review before script goes to client
6. **Editor fix-feedback loop** after senior editor review
7. **Editor queue management** — editors prioritize which uploaded footage to work on based on weekly targets
8. **KPI timestamp nuance:** "Create script" = start date only. "Script submitted" = the KPI comparison point
9. **KPIs are per-department:** writer KPIs, senior writer KPIs, writing department aggregate, same for editing, strategists, YouTube managers
10. **Clayton's prior app (Base44):** Had client portal with calendar, project status board, onboarding resources/FAQ, channel performance (all deferred to later phases)
11. **Welcome message current content:** GDrive link, Dropbox link, Loom recording video, thumbnail instructions, upload instructions
12. **Archival strategic value:** Real estate video/script corpus for future AI training models

## Open Ask

Clayton explicitly asked for a **projected V1 deadline** (17:19-17:35).
