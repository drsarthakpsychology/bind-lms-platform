import type { Scenario } from "../scenarios";
import { b, s } from "./make";

/**
 * Boundaries and professional ethics: gifts, dual relationships, social media,
 * touch, self-disclosure, small-town and community ties, confidentiality and
 * the duty to protect, a supervisor's misconduct, students as friends, money,
 * and the limits of online and telehealth work.
 */
export const BOUNDARIES: Scenario[] = [
  // Gifts
  s("wy-g001", "boundaries", "A small gift at the end of therapy", "therapies", "ethics-law", 1, "CUS", "Accept a small, meaningful end-of-therapy gift with thought", "Meera, 34, last session after panic treatment", [
    b("She hands you a box of homemade thepla and a thank-you card.", [
      ["b", "Thank her warmly, accept it, and note it in the file", "She leaves proud of her progress. A small, low-value gift at the end of therapy is usually fine to accept, and noting it keeps things transparent."],
      ["h", "Refuse firmly and tell her gifts are against the rules", "She leaves the last session feeling foolish and rejected. A blunt refusal of a small, sincere gift can undo the warm ending you built."],
      ["o", "Accept it but say nothing about it and leave it out of the notes", "Nothing goes wrong today, but gifts that are never recorded make patterns hard to spot later. A short note protects both of you."],
    ]),
  ]),
  s("wy-g002", "boundaries", "An expensive gift", "therapies", "ethics-law", 2, "CUS", "Decline a costly gift while keeping the relationship", "Rajiv, 52, businessman, in therapy for grief", [
    b("He gives you a new smartwatch “for all your help”.", [
      ["o", "Accept it for now, then plan to post it back to him quietly next month", "He reads your acceptance as agreement, then feels confused when it comes back. Delay makes the refusal harder for him."],
      ["h", "Accept it, since refusing would insult him", "You now owe him something, and he may expect special treatment. Costly gifts blur the line between client and friend."],
      ["b", "Thank him, decline kindly, and explore what the gift means to him", "He talks about feeling he must repay everyone who helps him. Declining gently opens useful work instead of closing it."],
    ]),
  ]),
  s("wy-g003", "boundaries", "Festival sweets from a family", "child", "ethics-law", 1, "CUS", "Respond to customary festival gifts in an Indian clinic", "Parents of a 9-year-old with ADHD, before Diwali", [
    b("They bring a box of kaju katli for the clinic staff.", [
      ["b", "Thank them and share the sweets with the whole team", "The family feels their custom is respected. Small festival sweets shared openly are an ordinary courtesy, not a bribe."],
      ["h", "Return the box and explain that clinics cannot take anything", "The parents feel insulted on a festival day and become cold in sessions. Rejecting a cultural courtesy can damage trust."],
      ["o", "Take the box home for yourself without telling the team", "No harm is visible, but a gift meant for the clinic is now personal. Sharing it keeps it what the family intended."],
    ]),
  ]),
  s("wy-g004", "boundaries", "Gift that keeps coming", "personality", "ethics-law", 5, "UMS", "Notice a pattern of gifts and address its meaning", "Kavita, 29, weekly therapy for low self-worth", [
    b("This is the fifth small gift in five weeks: earrings this time.", [
      ["h", "Keep accepting them so she does not feel hurt", "The gifts grow and she starts asking for extra time. A repeated gift pattern can be a bid for special status that harms the work."],
      ["o", "Tell the receptionist to refuse any gifts she brings in future", "The gifts stop, but she never learns why, and you lose the chance to understand what she was trying to say."],
      ["b", "Name the pattern kindly and explore what giving means for her", "She says she fears people will leave unless she gives. This becomes the main work of therapy, which the gifts were pointing to."],
    ]),
    b("She cries and says you must be tired of her, and offers to stop the gifts if you still like her.", [
      ["o", "Reassure her again and again that you like her and will never leave her", "She feels better for an hour, then needs more reassurance. Repeated reassurance feeds the fear instead of easing it."],
      ["b", "Say the work goes on without gifts, and link her fear to the pattern you are exploring", "She notices she does the same with friends. Steady limits plus a link to her pattern help her change."],
      ["h", "Say yes, it is getting too much, and you would like her to stop", "She hears that she is a burden and misses the next session. Limits must be set without shaming."],
    ], "You have just named the pattern of gifts."),
  ]),
  s("wy-g005", "boundaries", "Gift with a request", "substance", "ethics-law", 4, "UMS", "Separate a gift from a request for a favour", "Arvind, 41, alcohol use, needs a fitness certificate for work", [
    b("He leaves an envelope of cash “for your time” and asks you to write that he has been sober for a year.", [
      ["b", "Return the cash and say you can only write what is true", "He is angry for a moment, then admits he relapsed last month. Honesty keeps the report valid and keeps you safe from a bribery charge."],
      ["o", "Return the cash but write a vague letter that avoids the sobriety question", "A vague letter may still be read as support, and his employer may rely on it. Reports must state facts clearly."],
      ["h", "Keep the cash and write the letter he wants", "If he drinks at work and someone is hurt, the false letter traces back to you. This is corruption and false certification."],
    ]),
  ]),
  s("wy-g006", "boundaries", "Child's drawing as a gift", "child", "ethics-law", 1, "CUS", "Receive a child's handmade gift warmly", "Ishaan, 7, play therapy for separation anxiety", [
    b("He gives you a crayon drawing of the two of you in the playroom.", [
      ["o", "Thank him quickly and put it away in a drawer so the session can move on", "He watches the drawing disappear and goes quiet. A child reads how you treat his gift as how you treat him."],
      ["h", "Tell him therapists cannot keep presents", "He looks crushed and refuses to draw again. Refusing a child's drawing is needless and hurtful."],
      ["b", "Thank him, talk about the drawing together, and keep it", "He tells you the drawing shows the room where he feels brave. A child's drawing is part of the therapy, not a boundary problem."],
    ]),
  ]),
  s("wy-g007", "boundaries", "Full case: gifts, a will and an older client", "dementia", "ethics-law", 5, "UMDS", "Handle a large bequest offer and protect a vulnerable client", "Mr Iyer, 78, early dementia, lives alone in Chennai", [
    b("He says he wants to leave you his flat in his will because his children never visit.", [
      ["h", "Thank him and say it is his choice to make", "His children later challenge the will and you face an inquiry. Accepting a bequest from a vulnerable client looks like undue influence, whatever you intended."],
      ["b", "Decline clearly, say you cannot benefit from his care, and explore his loneliness", "He cries about his son, and you begin work on contact with the family. Clear refusal protects him and keeps the therapy about his needs."],
      ["o", "Say nothing for now and hope that he forgets about the idea in a few weeks, given his memory", "He mentions it to his lawyer the next week. Leaving it unanswered lets a risky plan grow."],
    ]),
    b("A week later his neighbour says he has already changed his will to name you.", [
      ["o", "Tell him to change it back, but keep it between the two of you and do nothing else", "He may not follow through, and nothing is on record. You need advice and documentation, not just a word to him."],
      ["b", "Tell your supervisor, record it, and suggest he gets independent legal advice", "The lawyer helps him revise the will and the record shows you acted openly. Seeking advice protects a vulnerable client and you."],
      ["h", "Leave it alone, since he did it without asking you", "You remain named in a will of a client with dementia. If the family sues, silence looks like consent."],
    ], "He has early memory problems and no other visitors."),
  ]),

  // Dual relationships
  s("wy-g008", "boundaries", "Neighbour asks for therapy", "therapies", "ethics-law", 1, "CUS", "Refer people you know socially", "Your next-door neighbour, 45, struggling after a divorce", [
    b("“You're a psychologist. Can I just see you on Saturdays at your place?”", [
      ["b", "Say you care, but refer her to a trusted colleague", "She gets proper help without the awkwardness of meeting her therapist at the gate each morning. Treating people you know well clouds judgement."],
      ["h", "Agree, since you already know her story", "Sessions slide into chats, and when she sees your family she stops being honest. Mixing roles harms both the therapy and the friendship."],
      ["o", "Offer to give her a few coping tips over tea on Saturdays instead of formal sessions", "Tips feel kind but she needs real therapy, and casual advice from a neighbour can delay it."],
    ]),
  ]),
  s("wy-g009", "boundaries", "Client offers a business deal", "anxiety", "ethics-law", 2, "CUS", "Avoid business relationships with current clients", "Sanjay, 38, runs a travel agency, therapy for health anxiety", [
    b("He offers you a big discount on a family holiday package.", [
      ["h", "Take the discount, since it is only a business transaction", "You now owe him, and when he struggles to pay his session fees you feel awkward raising it. Business ties distort therapy."],
      ["o", "Book through his agency but insist on paying the normal full price like any other customer", "You pay fairly, but you now depend on his business and he knows your travel plans. It is still a second relationship."],
      ["b", "Thank him and decline, keeping your relationship as therapy only", "He shrugs and the session goes on. Keeping a single clear role protects his treatment."],
    ]),
  ]),
  s("wy-g010", "boundaries", "Treating a colleague's spouse", "depression", "ethics-law", 5, "UMS", "Spot a hidden dual relationship before it starts", "Referral note: wife of your clinic's accountant", [
    b("You realise the new client is married to someone you work with daily.", [
      ["b", "Explain the link to her and offer referral to someone outside the clinic", "She is relieved and opens up fully elsewhere. Naming the conflict early respects her right to choose."],
      ["o", "See her but promise yourself you will never discuss her with him", "She later hesitates to talk about her marriage, knowing you see him daily. The conflict is in the room even if you stay silent."],
      ["h", "See her and say nothing about the connection", "When she finds out, she feels deceived. Hiding a dual relationship breaks trust."],
    ]),
    b("She chooses to stay with you. A month later her husband asks you at lunch how his wife is doing.", [
      ["h", "Tell him she is doing better, since he means well", "She learns you spoke to him and stops trusting you. Even good news shared with a spouse is a breach."],
      ["b", "Say you never talk about clients, and tell her in session that he asked", "He accepts it and she feels protected. Keeping her informed shows the boundary works."],
      ["o", "Avoid eating lunch with him from now on so the question never comes up again", "The office notices and gossips. A clear, polite reply is enough."],
    ], "You had offered referral and she said no."),
  ]),
  s("wy-g011", "boundaries", "Romantic interest from a client", "personality", "ethics-law", 2, "CUSD", "Respond to a client's romantic feelings safely", "Aditya, 30, therapy for loneliness", [
    b("“I think I'm falling for you. Could we meet for coffee after this ends?”", [
      ["h", "Say maybe after therapy ends, if he still feels the same way about you then", "He waits, the therapy turns into courting, and the work stops. Hinting at a future relationship is a serious violation."],
      ["b", "Thank him for his honesty, be clear it cannot happen, and explore the feelings", "He talks about how rarely he feels understood. Clear limits plus curiosity turn the moment into therapy."],
      ["o", "End therapy at once and refer him on", "He feels punished for honesty. Referral may be needed later, but abrupt endings can feel like rejection."],
    ]),
  ]),
  s("wy-g012", "boundaries", "Sexual contact with a former client", "therapies", "ethics-law", 4, "UMDS", "Know that sexual contact with clients is never acceptable", "Former client, therapy ended two years ago", [
    b("You meet her at a friend's wedding and she asks you out.", [
      ["o", "Say you need to wait a few more years, and then decide together whether to meet", "Waiting does not remove the power gap or the old transference. The safer view, held by most codes, is that it should not happen."],
      ["h", "Agree, since therapy ended long ago", "She later says the relationship felt like an extension of therapy and files a complaint. Many professional codes treat this as a violation however long ago therapy ended."],
      ["b", "Decline politely and keep the relationship professional", "She is a little embarrassed but understands. The power and knowledge you held in therapy do not vanish at the end."],
    ]),
  ]),
  s("wy-g013", "boundaries", "Hiring a client", "schizophrenia", "ethics-law", 5, "UMS", "Avoid employing a current client", "Ramesh, 33, recovering from psychosis, looking for work", [
    b("He asks if he can do data entry for your clinic.", [
      ["b", "Help him with vocational referrals, but do not hire him yourself", "He gets a supported job through a rehabilitation centre. Being his boss and therapist would trap him if work went badly."],
      ["h", "Hire him, since you know his strengths", "When his work slips, you must warn him and treat him at once. He loses both the job and the therapy."],
      ["o", "Hire him for a short paid trial and see how it goes before you decide anything", "Even a short trial makes you his employer. If it fails, the therapy carries the damage."],
    ]),
    b("He says that if you will not hire him, you must think he is useless.", [
      ["o", "Hire him for one week anyway, to prove to him that you really do believe in him and his work", "A trial makes you his boss after all. Proving belief does not need a job offer."],
      ["b", "Explain it is about your role, not his ability, and list his strengths for applications", "He takes your list to the rehabilitation centre and gets an interview. Naming strengths keeps his hope alive."],
      ["h", "Tell him to stop asking and change the subject", "He feels rejected and his confidence drops. His fear deserves an answer."],
    ], "You have just declined to hire him."),
  ]),
  s("wy-g014", "boundaries", "Full case: a client becomes your landlord", "anxiety", "ethics-law", 5, "UMS", "Manage an unavoidable dual role openly", "Neha, 40, owns the building your new clinic is in", [
    b("You learn the building owner is your client of six months.", [
      ["h", "Ignore it, since the lease is with her company", "She later raises the rent in a session and you feel unable to object. A hidden money link quietly shapes the therapy."],
      ["o", "Discuss rent issues with her during sessions to save time", "Sessions turn into tenant meetings. Mixing business into the therapy hour harms her care."],
      ["b", "Raise it openly, discuss options, and consider referral", "She chooses to continue with a colleague and keeps you as tenant only. Talking it through lets her decide with full information."],
    ]),
    b("She wants to stay with you as her therapist and says the lease does not matter to her.", [
      ["b", "Explain the risks, agree rules on keeping business out of sessions, and take supervision", "You both know where the lines are, and your supervisor helps you watch for strain. Some dual roles can be managed if handled openly."],
      ["h", "Agree and change nothing", "When a pipe bursts and she is slow to fix it, your irritation leaks into sessions. Unmanaged dual roles harm the work."],
      ["o", "Agree to continue, but cut sessions to once a month so that the business link matters less", "Less contact does not fix the conflict and her care becomes thin. The issue is the dual role, not session frequency."],
    ], "She is improving and values the work."),
  ]),

  // Social media
  s("wy-g015", "boundaries", "Friend request from a client", "therapies", "ethics-law", 1, "CUS", "Decline social media contact with clients", "Pooja, 25, in therapy for social anxiety", [
    b("She sends you a friend request on Instagram.", [
      ["h", "Accept it, since refusing a request could make her social anxiety and fear of rejection worse", "She sees your weekend photos and starts comparing her life to yours. Personal social media pulls you into her private world and her into yours."],
      ["o", "Ignore the request and never mention it", "She wonders if you are angry with her. An unspoken refusal can feel like rejection."],
      ["b", "Leave it unaccepted and explain your social media policy at the next session", "She understands it is a rule for everyone, not about her. A clear, kind explanation protects the relationship."],
    ]),
  ]),
  s("wy-g016", "boundaries", "Searching a client online", "schizophrenia", "ethics-law", 5, "UMS", "Avoid searching clients online without a clear reason", "Vikram, 28, new client with a vague history", [
    b("You are tempted to look up his social media before the next session.", [
      ["b", "Ask him directly in session, and only search with consent and a clear clinical reason", "He fills in the gaps himself. Information he chooses to share is more useful and respects his privacy."],
      ["o", "Look quickly before the session, but do not mention to him that you looked or what you saw", "You now hold information he did not choose to share, and it colours how you see him. Secret searching affects trust even if he never learns of it."],
      ["h", "Look through his profiles and ask him about what you found", "He feels watched and stops attending. Surprise disclosure of searched information feels like surveillance."],
    ]),
    b("A colleague shows you a public post from his account that suggests he plans to harm himself.", [
      ["h", "Ignore it, since you have a rule against searching", "A clear risk sign is now in front of you. Rules about searching do not mean ignoring safety information."],
      ["b", "Contact him today, tell him what you saw and how, and assess risk", "He admits he wrote it late at night and agrees to a safety plan. Being open about how you saw it keeps trust."],
      ["o", "Wait until his next session in five days", "Five days is too long for a possible suicide warning. Same-day contact is needed."],
    ], "You did not search for it yourself."),
  ]),
  s("wy-g017", "boundaries", "Client posts about you", "personality", "ethics-law", 3, "UMS", "Respond to a client's public post about therapy", "Riya, 26, posts a long story about her sessions and tags your clinic", [
    b("The post names you and praises you, but includes details of her trauma.", [
      ["h", "Comment to thank her publicly", "You confirm in public that she is your client. Even replying to praise breaks confidentiality."],
      ["b", "Do not reply online, and gently discuss the post with her in session", "She decides to edit out her trauma details. She owns her story, but you can help her think about what she shares."],
      ["o", "Message her straight away to ask her to take the post down at once, before more people see it", "She feels told off and removes it, but you lose the chance to explore why she shared it."],
    ]),
  ]),
  s("wy-g018", "boundaries", "Negative online review", "therapies", "ethics-law", 4, "UMDS", "Respond to a bad review without breaking confidentiality", "One-star review from a client you discharged", [
    b("The review says you ignored her and were rude. It is untrue, and many people have seen it.", [
      ["o", "Ask friends and family to post good reviews so the bad one is pushed down the page", "Fake reviews are dishonest and, if found out, damage your name far more than one bad review."],
      ["h", "Reply with the true facts of her case so that readers can see the review is wrong", "You disclose her treatment in public. Defending yourself does not override confidentiality."],
      ["b", "Post only a general reply about your values, or none, and seek advice", "Readers see a calm, private professional. A general reply protects her privacy and your reputation."],
    ]),
  ]),
  s("wy-g019", "boundaries", "Your own public posts", "therapies", "ethics-law", 1, "CUS", "Keep your personal online life separate", "You, a trainee psychologist with a public Instagram", [
    b("A client mentions a photo from your college party.", [
      ["b", "Make personal accounts private and keep a separate work page", "Clients see only what you choose. Planning your online presence prevents surprises in the room."],
      ["h", "Post more so clients feel they know you better", "Sessions become about your life. Oversharing online shifts the focus away from clients."],
      ["o", "Delete all your social media for good", "It removes the problem, but is more than you need. Privacy settings and a separate page usually do the job."],
    ]),
  ]),
  s("wy-g020", "boundaries", "Client messages late at night on WhatsApp", "suicide", "ethics-law", 3, "UMS", "Set clear limits on messaging while keeping safety", "Ananya, 22, emotional dysregulation, has your number from the clinic form", [
    b("She sends long messages at 1 am most nights.", [
      ["h", "Reply every time to keep her safe", "She sends more, and you burn out within weeks. Round-the-clock replies make her depend on you instead of her own plan."],
      ["b", "Agree when messages are used, and give her a night crisis plan and helpline", "The night messages drop and she uses her plan. Clear limits plus a real crisis route are safer than you on call."],
      ["o", "Block her number without telling her, so the messages stop and she learns to cope alone", "She feels abandoned at night. Cutting contact without a plan can raise risk."],
    ]),
  ]),
  s("wy-g021", "boundaries", "Full case: a viral video", "ptsd", "ethics-law", 5, "UMDS", "Protect a client's identity when your content goes viral", "You make short educational reels for your practice", [
    b("A client recognises her own story, lightly changed, in your reel about trauma. It has a lakh views.", [
      ["b", "Apologise, take the reel down, and discuss how to repair trust", "She is shaken but stays in therapy. Owning the mistake quickly limits harm."],
      ["o", "Tell her it was a mix of many clients so it is not really hers", "She still sees her details and feels unsafe. Arguing about the facts does not repair the hurt."],
      ["h", "Leave it up, since you changed her name", "Her cousin recognises her and the family hears about the abuse. Changing a name is not enough to hide a story."],
    ]),
    b("You want to keep making content.", [
      ["h", "Keep using client stories but change more details", "Another client recognises themselves. Any client story, however changed, risks identification."],
      ["o", "Keep using client stories, but first ask each client for written consent to use their story", "Some agree because they fear saying no to their therapist. Consent from current clients is rarely truly free."],
      ["b", "Make content only from general knowledge and invented composite examples", "Your videos still teach well. General facts and clearly invented examples carry no client risk."],
    ], "The reel is down and she has returned for her next session."),
  ]),

  // Touch
  s("wy-g022", "boundaries", "Client wants a hug", "depression", "ethics-law", 2, "CUS", "Respond to a request for a hug thoughtfully", "Sunita, 50, in grief therapy after her husband's death", [
    b("At the end of a tearful session she opens her arms for a hug.", [
      ["o", "Hug her tightly for as long as she needs, since grief is a time for comfort, not rules", "She feels comforted, but a long hug moves into personal closeness. If touch happens, it should be brief and client-led."],
      ["h", "Step back sharply and say touch is not allowed", "She feels ashamed of her grief. A cold refusal at a raw moment can wound."],
      ["b", "Offer a brief side hug or warm handshake, and keep it client-led", "She leaves feeling cared for. Brief, non-sexual, client-led contact can be fine with thought and a note."],
    ]),
  ]),
  s("wy-g023", "boundaries", "Touch and trauma", "ptsd", "ethics-law", 3, "UMS", "Avoid touch with a client who has a sexual trauma history", "Neelam, 23, PTSD after sexual assault", [
    b("She starts to panic in session and you want to calm her.", [
      ["h", "Put your hand on her shoulder", "She flinches and freezes. Unexpected touch can trigger a trauma response."],
      ["b", "Stay calm, keep your distance, and guide her breathing", "She settles within minutes. Grounding with your voice gives safety without touch."],
      ["o", "Ask her whether you can hold her hand until the panic passes, and do so if she says yes", "Asking is better than touching, but she may agree out of fear. Voice and grounding are safer first."],
    ]),
  ]),
  s("wy-g024", "boundaries", "Child climbs into your lap", "child", "ethics-law", 2, "CUS", "Handle touch from young children safely", "Tara, 5, play therapy", [
    b("She climbs into your lap during a story.", [
      ["b", "Gently move her to sit beside you and keep reading", "She is happy beside you. Gentle redirection protects both child and therapist."],
      ["h", "Let her sit in your lap for the rest of the session, since she is only five", "Her parent sees this through the window and is worried. Prolonged lap-sitting crosses a line in therapy."],
      ["o", "Tell her off firmly for climbing on you", "She feels she has done something bad. Redirection works without shame."],
    ]),
  ]),
  s("wy-g025", "boundaries", "Physical exam and a psychologist", "dsm-somatic", "ethics-law", 3, "UMS", "Stay within your role on physical examination", "Kunal, 35, chest pain with panic, seen by a psychologist", [
    b("He asks you to check his heart rate and listen to his chest.", [
      ["o", "Check his pulse at the wrist to reassure him", "It reassures him for a day, but a single pulse check is not a medical assessment and blurs your role."],
      ["b", "Explain that physical checks are for his doctor, and help him see one", "A doctor finds his heart is healthy and he trusts the result. Staying in role keeps care safe."],
      ["h", "Borrow a stethoscope and check his chest yourself so he can be reassured today", "You are not trained to examine and may miss a real problem. This is outside a psychologist's role."],
    ]),
  ]),
  s("wy-g026", "boundaries", "Massage offered as therapy", "therapies", "ethics-law", 4, "UMDS", "Recognise harmful touch dressed as treatment", "A colleague's wellness centre", [
    b("A colleague says he uses massage to release trauma during psychotherapy sessions.", [
      ["h", "Join in to learn the technique", "Clients later report feeling violated. Touch-based methods inside psychotherapy invite boundary violations."],
      ["o", "Say nothing to him, since how he runs his own wellness centre is his own business", "Clients may be at risk. Concern about a colleague's practice should be raised."],
      ["b", "Raise your concern and suggest he takes advice from his supervisor", "He stops the practice after review. Speaking up early protects clients."],
    ]),
  ]),
  s("wy-g027", "boundaries", "Full case: a client asks to hold hands", "personality", "ethics-law", 5, "UMDS", "Hold a boundary and explore its meaning", "Shreya, 27, borderline personality disorder", [
    b("“If you won't hold my hand, I'll know you don't care.”", [
      ["o", "Hold her hand briefly this once, to show that you care and to keep her in therapy", "She asks for more next time. Giving in to a test teaches that pressure works."],
      ["b", "Say you care, that holding hands is not part of therapy, and explore the feeling", "She is angry, then talks about feeling dropped by her mother. The boundary and the warmth both hold."],
      ["h", "Tell her she is manipulating you", "She feels attacked and storms out. Labelling her as manipulative closes the work."],
    ]),
    b("She says she will find a therapist who really cares.", [
      ["b", "Stay calm, say you want to keep working, and invite her to the next session", "She returns next week. Steady warmth through anger is part of the treatment."],
      ["h", "Agree she should go elsewhere", "She hears confirmation that she is too much. Pushing her away repeats her old pattern."],
      ["o", "Offer her an extra session later the same week to win her back and calm things down", "It soothes for now but teaches that anger earns extras. Stable limits help more."],
    ], "She is standing near the door."),
  ]),

  // Self-disclosure
  s("wy-g028", "boundaries", "Client asks if you have children", "therapies", "ethics-law", 1, "CUS", "Handle a personal question simply", "Lakshmi, 33, parenting stress", [
    b("“Do you have kids? You wouldn't understand otherwise.”", [
      ["h", "Tell her all about your own children's problems", "The session becomes about your family. Long disclosures move the focus to you."],
      ["b", "Answer briefly if comfortable, then bring the focus back to her", "She feels heard and keeps talking. Brief, honest answers that return to the client usually work."],
      ["o", "Refuse to answer and say it is not relevant", "She feels shut out. A cold refusal can sound like you think her worry is silly."],
    ]),
  ]),
  s("wy-g029", "boundaries", "Sharing your own depression", "depression", "ethics-law", 3, "UMS", "Use self-disclosure only when it helps the client", "Amit, 24, hopeless about recovery", [
    b("You once had depression and recovered. He says nobody ever gets better.", [
      ["o", "Tell him your full story so he sees recovery is possible", "He starts asking about your treatment instead of his. A long story makes you the subject."],
      ["h", "Say you know exactly how he feels because you had it too", "He feels you have assumed his experience. Claiming to know exactly how someone feels shuts them down."],
      ["b", "Say briefly that many people recover, and ask what he fears", "He talks about fear of failing again. A short, general message of hope keeps the focus on him."],
    ]),
  ]),
  s("wy-g030", "boundaries", "Disclosing your religion", "therapies", "ethics-law", 2, "CUS", "Keep personal beliefs out of the therapy agenda", "Farhan, 36, asks about your faith", [
    b("“Are you Hindu? Will you judge me for being Muslim?”", [
      ["b", "Answer if you wish, say you will not judge, and explore his worry", "He talks about past discrimination. Hearing his fear matters more than your faith."],
      ["h", "Talk about your religious views at length", "He feels pressured. Your beliefs should not become part of his therapy."],
      ["o", "Say that religion is never discussed in therapy, so he does not need to worry about it at all", "He feels his worry is dismissed. Faith can be part of a client's life and therapy."],
    ]),
  ]),
  s("wy-g031", "boundaries", "Talking about your own break-up", "personality", "ethics-law", 4, "UMS", "Notice when disclosure serves your needs, not the client's", "You are going through a divorce; a client describes hers", [
    b("You feel the urge to share how you are coping.", [
      ["h", "Share, since it might help her feel less alone", "She starts comforting you. Disclosure driven by your own pain reverses the roles."],
      ["o", "Share a little about your own divorce and then move on quickly to her story", "Even a little opens the door when you are raw. You may share more than you mean."],
      ["b", "Hold back, and take your feelings to your own supervisor or therapist", "The session stays about her. Supervision gives your own grief a proper place."],
    ]),
  ]),
  s("wy-g032", "boundaries", "Being recognised as in recovery", "substance", "ethics-law", 3, "UMS", "Use lived experience carefully as a recovery worker", "You are a counsellor in recovery from alcohol; a client asks about it", [
    b("“Is it true you used to drink? How did you stop?”", [
      ["o", "Tell him the whole story of your drinking days, so he sees how bad it got and how you stopped", "He enjoys the stories but treats drinking as a war story. Too much detail can glamourise use."],
      ["b", "Say yes briefly, share what helped in general terms, and ask about his goals", "He feels hope and talks about his own plan. Brief lived experience can be powerful when kept short."],
      ["h", "Deny it to keep your privacy", "He later learns the truth and feels lied to. A false denial damages trust more than a refusal."],
    ]),
  ]),
  s("wy-g033", "boundaries", "Crying with a client", "depression", "ethics-law", 2, "CUS", "Respond when your own emotion shows", "A mother describes her son's death", [
    b("Your eyes fill with tears as she speaks.", [
      ["b", "Let it show briefly, stay with her, and keep the focus on her loss", "She feels her grief is real to you. Brief, contained emotion can deepen the connection."],
      ["h", "Leave the room until you are calm", "She feels she has upset you. Leaving abruptly makes her care for you."],
      ["o", "Apologise to her again and again for crying, so she knows you are being professional", "She ends up reassuring you. Too much apology makes it about you."],
    ]),
  ]),
  s("wy-g034", "boundaries", "Full case: a client asks where you live", "schizophrenia", "ethics-law", 5, "UMS", "Protect your privacy while keeping trust", "Ravi, 31, schizophrenia with some paranoid ideas", [
    b("“Where do you live? I want to know you are a real person.”", [
      ["h", "Give him your area so he trusts you", "He walks past your building the next week. Home details can lead to unsafe contact."],
      ["b", "Kindly say you keep your home private, and explore his worry about trust", "He talks about fearing people are not who they say. His worry is the real topic."],
      ["o", "Laugh it off kindly and change the subject to his medicines and his sleep", "He feels mocked and becomes more suspicious."],
    ]),
    b("Two weeks later he says he saw you at the vegetable market and followed you for a while.", [
      ["o", "Ignore it, since nothing actually happened and raising it might make him more paranoid", "He may do it again. Following you is a safety issue that should be named."],
      ["h", "Stop seeing him at once", "He feels rejected and his paranoia grows. Abrupt ending without a plan raises risk."],
      ["b", "Name it calmly, set a clear limit, tell your supervisor, and review risk", "He apologises and agrees not to follow you. Clear limits, risk review and support keep you both safe."],
    ], "He is calm and apologetic in the room."),
  ]),

  // Small towns, family and caste or community ties
  s("wy-g035", "boundaries", "The only psychologist in town", "depression", "ethics-law", 5, "UMS", "Manage unavoidable overlaps in a small town", "You work alone in a taluka town in Kutch", [
    b("Your client runs the only pharmacy, and you meet him every week to buy medicines.", [
      ["h", "Ask him about his mood when you buy medicines", "Other customers hear. Bringing therapy into his shop breaks his privacy."],
      ["o", "Drive to a pharmacy in another town each week, so that the two of you never meet outside sessions", "You lose an hour each week. Total avoidance is not always needed; clear rules can work."],
      ["b", "Agree together how you will greet each other and keep therapy to sessions", "You nod politely at the shop and keep all talk for sessions. In small places, overlap is managed, not banned."],
    ]),
    b("He calls you at home at night asking for advice about his panic attacks.", [
      ["o", "Help him over the phone for as long as he needs, since this is how things work in a small town", "Night calls become routine and you burn out. Small places still need limits."],
      ["h", "Tell him never to call you again", "He feels ashamed and avoids the next session. A kind limit works better."],
      ["b", "Help him with the crisis briefly, then agree a plan for out-of-hours help", "He uses the plan next time. Clear limits protect both of you in a small town."],
    ], "You see him every week at the pharmacy."),
  ]),
  s("wy-g036", "boundaries", "Same caste community", "therapies", "ethics-law", 5, "UMS", "Handle a client from your own close community", "Nikita, 29, from your community, in Rajkot", [
    b("Her family attends the same community gatherings as yours.", [
      ["b", "Discuss how you will handle meeting at gatherings, and offer referral if she prefers", "She chooses to stay and you agree not to acknowledge therapy in public. Talking it through gives her control."],
      ["h", "Tell your mother you are seeing her, since the family is close", "Word spreads through the community. This is a serious breach of confidentiality."],
      ["o", "Avoid all community events and family functions for as long as she remains your client", "You miss your own family's events. Rules about how to meet often work better than total avoidance."],
    ]),
    b("A community elder asks you to help arrange her marriage because you know her family's troubles.", [
      ["h", "Agree, since you know her well", "You are now using therapy knowledge for community business. This breaks confidentiality and role."],
      ["o", "Say you are far too busy with work this season to help with any marriage plans", "He may ask again. A clear reason is better."],
      ["b", "Say kindly that you never take part in such matters", "He accepts it and nothing about her therapy is revealed. Stepping back without explaining protects her."],
    ], "She has chosen to stay in therapy with you."),
  ]),
  s("wy-g037", "boundaries", "Relative asks about a client", "schizophrenia", "ethics-law", 1, "CUS", "Keep confidentiality with your own family", "Your aunt at a family wedding", [
    b("“I heard the Shah boy is seeing you. Is he mad?”", [
      ["o", "Say you cannot say anything, but hint that it is nothing serious so she stops worrying", "Even a hint confirms he is your client. Hints break confidentiality too."],
      ["h", "Tell her what you know so she stops gossiping", "The story now spreads with your authority behind it. You have breached his privacy."],
      ["b", "Say you never talk about who you see, and change the topic", "She is curious but drops it. A standard reply protects everyone."],
    ]),
  ]),
  s("wy-g038", "boundaries", "Village elder wants a report", "schizophrenia", "ethics-law", 4, "UMDS", "Resist community pressure for client information", "Sarpanch of a village near Udaipur", [
    b("He visits your camp and asks whether a young man you treat is fit to marry.", [
      ["b", "Say you cannot share anything without his consent, and offer general facts", "He leaves with useful general facts and the man's privacy is safe. Consent decides who learns what."],
      ["h", "Answer, since the community has a right to know", "The young man's marriage talks collapse. Community leaders have no right to health information."],
      ["o", "Say the young man is perfectly fine, to protect his chances of marriage in the village", "You have still confirmed he is your patient. Any comment about a client is disclosure."],
    ]),
  ]),
  s("wy-g039", "boundaries", "Marriage and illness disclosure", "schizophrenia", "ethics-law", 5, "UMDS", "Balance a client's privacy and a future spouse's interest", "Vijay, 27, schizophrenia, well on treatment, family arranging his marriage", [
    b("His parents ask you not to tell the girl's family about his illness.", [
      ["o", "Tell the girl's family yourself to be fair to her", "You break his confidentiality without his consent. This is not your disclosure to make."],
      ["b", "Explain you cannot share without his consent, and encourage the family to be honest", "Vijay decides to tell her himself. Supporting honest disclosure respects him and her."],
      ["h", "Help the family hide it, and stop his medicine before the wedding so he looks well", "He relapses on his wedding night. Stopping treatment to hide illness is dangerous."],
    ]),
    b("Vijay wants to tell her but is afraid.", [
      ["b", "Help him plan what to say, and offer a joint meeting if he wishes", "The meeting goes better than he feared. Support for honest disclosure gives the marriage a fair start."],
      ["h", "Tell him it is better to wait until after the wedding", "Concealment before marriage can later be used against him in court. Hiding it now builds future harm."],
      ["o", "Write a formal letter on his behalf explaining his illness, so he does not have to say it himself", "A letter may feel cold and does not answer her questions. A conversation, with support, is better."],
    ], "He is stable on medicine and attends regularly."),
  ]),
  s("wy-g040", "boundaries", "Meeting a client at a temple", "therapies", "ethics-law", 1, "CUS", "Respond to a chance public meeting", "You see your client at a temple festival", [
    b("She is with her family and looks at you.", [
      ["b", "Wait for her lead and greet her only if she greets you", "She smiles and moves on. Letting the client lead protects her privacy."],
      ["h", "Go over and introduce yourself to her family as her psychologist", "Her family did not know she was in therapy. You have disclosed it."],
      ["o", "Turn away quickly and pretend not to see her", "She wonders if you are avoiding her. Letting her lead is kinder."],
    ]),
  ]),
  s("wy-g041", "boundaries", "Full case: a family in a small town", "suicide", "ethics-law", 5, "UMDS", "Manage confidentiality and safety in a close-knit town", "Pallavi, 17, self-harm, from a family you know in your town", [
    b("She asks you not to tell her parents, who are friends of your parents.", [
      ["o", "Promise complete secrecy, since keeping her trust matters more than anything else right now", "If her risk rises, you cannot keep the promise. False promises break trust later."],
      ["h", "Tell her parents straight away, without discussing it with her", "She feels betrayed and refuses to come back. Acting without her makes things worse."],
      ["b", "Explain what stays private and what you must share for safety, then plan with her", "She agrees you can tell her parents about the self-harm, but not her diary. Clear limits keep her engaged."],
    ]),
    b("At a family function her mother asks you, in front of others, how her daughter is doing.", [
      ["h", "Give a brief update to reassure her", "Others hear and the gossip begins. Public updates break confidentiality."],
      ["o", "Say nothing at all and walk away, so nobody at the function guesses anything", "Her mother feels snubbed. A short reply about meeting privately works better."],
      ["b", "Say kindly that you will talk at the clinic, and call her to arrange it", "Her mother feels respected and others hear nothing. Moving the talk to the clinic protects everyone."],
    ], "Her parents now know she is in therapy."),
  ]),

  // Confidentiality and the duty to protect
  s("wy-g042", "boundaries", "Explaining confidentiality at the start", "interview", "ethics-law", 1, "CUS", "Explain the limits of confidentiality before therapy begins", "Rahul, 21, first session at a college counselling centre", [
    b("“Whatever I say here stays here, right?”", [
      ["o", "Say yes, everything stays private, so he feels safe enough to talk about anything at all", "If he later discloses a plan to hurt himself, you will have to break a promise you made. Limits must be stated at the start."],
      ["b", "Say most things stay private, and explain the few times you would have to share", "He nods and later trusts you when you need to act. Clear limits at the start make later action feel fair."],
      ["h", "Say you will tell his parents if anything worrying comes up", "He decides to say nothing worrying. Overstating what you share stops adult clients from opening up."],
    ]),
  ]),
  s("wy-g043", "boundaries", "Threat against a named person", "personality", "ethics-law", 5, "UMDS", "Act on a credible threat to a named person", "Deepak, 34, angry after losing his job", [
    b("“I know where my manager lives. I'm going to stab him this weekend.”", [
      ["h", "Keep it confidential, since he is your client", "If he acts, a man dies that you could have protected. Confidentiality gives way when a specific person faces serious harm."],
      ["b", "Check intent and plan, involve your supervisor, and act to protect the manager", "The police and the manager are informed and Deepak is admitted for assessment. The law allows you to share what is needed to prevent serious harm."],
      ["o", "Ask him to promise not to do it, and see him again next week to check that he has calmed down", "A promise is not a safety plan. A specific, credible threat needs action now."],
    ]),
    b("Deepak says he was only angry and begs you not to tell anyone.", [
      ["b", "Explain kindly what you must share and why, and keep him involved", "He is upset but agrees to an assessment. Being honest with him keeps some trust."],
      ["o", "Believe him and cancel your plan to inform anyone", "His plan was detailed a few minutes ago. A quick change of story does not remove the risk."],
      ["h", "Agree to keep it secret as long as he promises to stay at home all weekend and call you", "His manager stays unprotected. Promises do not replace action on a credible threat."],
    ], "He named the manager, the weapon and the day."),
  ]),
  s("wy-g044", "boundaries", "Vague anger, no target", "personality", "ethics-law", 4, "UMDS", "Tell vague anger apart from a credible threat", "Suresh, 45, venting about his in-laws", [
    b("“Sometimes I could kill them, they make me so angry.” He has no history of violence.", [
      ["o", "Call the police after the session to be on the safe side, since he used the word kill", "There is no plan or intent, and an unneeded report breaks trust and may harm him. Not every angry phrase is a threat."],
      ["b", "Ask calmly about intent, plans and past violence before deciding", "He laughs and says it is a figure of speech, with no plans. Careful questions separate venting from danger."],
      ["h", "Ignore it, since people say this all the time", "You miss the chance to check. Even common phrases deserve a few questions."],
    ]),
  ]),
  s("wy-g045", "boundaries", "Partner with HIV not told", "substance", "ethics-law", 5, "UMDS", "Handle a third party at risk of infection", "Manoj, 30, in counselling for drug use, has HIV and will not tell his wife", [
    b("He says his wife does not know and they do not use condoms.", [
      ["h", "Tell his wife yourself straight away", "He feels betrayed and drops out of all care. Disclosure without first working with him is a last resort, not a first step."],
      ["o", "Keep it secret and say nothing more, since his HIV status is his private medical information", "His wife remains at risk of infection. You have a duty to help protect her."],
      ["b", "Explain the risk to her, and work with him towards telling her", "He agrees to tell her with the doctor present. Supported disclosure protects her and keeps him in care."],
    ]),
    b("After several sessions he still refuses and says he will never tell her.", [
      ["o", "Keep encouraging him gently each week and wait for him to be ready, however long it takes", "Months pass and she remains at risk. There is a point where waiting is no longer safe."],
      ["b", "Consult his doctor and seniors on informing her, telling him first", "His doctor informs her through the proper process and she gets tested. A careful, consulted disclosure balances both duties."],
      ["h", "Stop seeing him because he will not listen", "He is out of care and she is no safer. Ending therapy helps no one."],
    ], "His doctor knows his HIV status."),
  ]),
  s("wy-g046", "boundaries", "Police ask for records", "schizophrenia", "ethics-law", 5, "UMS", "Respond to requests for records properly", "A police officer at your clinic desk", [
    b("He asks for a client's file without a court order.", [
      ["b", "Ask for the request in writing and check the legal basis before sharing anything", "He returns with an order, and only the needed part is shared. Records go out only with consent or a lawful order."],
      ["h", "Hand over the full file to avoid trouble", "You have shared private material with no legal basis. Fear of authority is not a reason to breach confidentiality."],
      ["o", "Refuse to speak to him at all and ask him to leave the clinic, since files are always private", "He returns angry with an order. Polite, clear process works better than refusal."],
    ]),
    b("The officer returns with a court order asking for the full file.", [
      ["h", "Refuse, since confidentiality is absolute", "Ignoring a court order can lead to contempt. Confidentiality has legal limits."],
      ["b", "Share what the order requires, tell your client, and ask to limit sensitive details", "Only the needed parts go out. Following the order while protecting the client is the right balance."],
      ["o", "Send the whole file to the court straight away without telling the client, to avoid any delay", "She learns later and feels betrayed. Tell her what has been shared."],
    ], "You have checked that the order is genuine."),
  ]),
  s("wy-g047", "boundaries", "Employer asks about an employee", "depression", "ethics-law", 1, "CUS", "Share nothing with employers without consent", "HR manager of a client's company calls", [
    b("“Is she fit to come back? What is wrong with her?”", [
      ["b", "Say you cannot confirm or share anything without her written consent", "The manager asks the employee for consent. She chooses what goes to her workplace."],
      ["o", "Say she is doing well and leave it there", "You have confirmed she is your client. Even good news is disclosure."],
      ["h", "Tell him she has depression so that he understands and can support her return to work", "Her diagnosis is now known at work. This is a clear breach."],
    ]),
  ]),
  s("wy-g048", "boundaries", "Full case: a teenager's secret and a planned attack", "child", "ethics-law", 5, "UMDS", "Balance a minor's privacy with others' safety", "Kabir, 16, bullied at school in Pune", [
    b("He says he has been looking up how to make petrol bombs to “teach them a lesson”.", [
      ["h", "Treat it as a joke and move on", "He was not joking. Talk of weapons and revenge needs careful checking."],
      ["b", "Ask about his plans, access and timing, calmly and directly", "He admits he has bought petrol and set a date. Calm questions reveal the real level of risk."],
      ["o", "Tell him you will have to report this, then end the session", "He clams up and you have no details. Assess first, then explain what you will do."],
    ]),
    b("You now know there is a plan and a date.", [
      ["o", "Tell only his parents and leave it to them", "His parents may not act, and the school is still at risk. The people at risk must be protected."],
      ["h", "Promise to keep it secret if he hands over the petrol and agrees to stay home that day", "The plan may continue with other means. A secret pact cannot keep others safe."],
      ["b", "Tell him you must act, then inform those who need to know to keep people safe", "The attack is prevented and he gets help with the bullying. Protecting others comes first, with him kept informed."],
    ], "He has bought petrol and named a day."),
    b("A week later he is back in therapy, furious that you told.", [
      ["b", "Acknowledge his anger, explain why you acted, and return to the bullying", "Over time he says you were the only one who took him seriously. Repair after a necessary breach rebuilds trust."],
      ["h", "Tell him he only has himself to blame", "He feels shamed and leaves. Blame blocks repair."],
      ["o", "Avoid the topic for now and talk about school work, until he calms down by himself", "His anger stays unspoken and grows. Naming it opens repair."],
    ], "He was not charged and the school has acted on the bullying."),
  ]),
  s("wy-g049", "boundaries", "Pilot with depression", "depression", "ethics-law", 5, "UMDS", "Weigh confidentiality against public safety in a safety-critical job", "Captain Rao, 42, airline pilot, severe depression with suicidal thoughts", [
    b("He says he is still flying and will not tell his airline.", [
      ["o", "Respect his wish, since it is his job", "Hundreds of passengers fly with a pilot who may be unsafe. Some jobs carry a risk to the public."],
      ["b", "Explain the safety concern and urge him to stop flying and see his medical examiner", "He agrees to take medical leave. Persuasion first often works and keeps trust."],
      ["h", "Call the airline today without telling him, since passenger safety comes before his feelings", "He is grounded and humiliated, and stops all care. Acting behind his back should be a last resort."],
    ]),
    b("He refuses and says he is flying tomorrow.", [
      ["h", "Leave it, since you have done your best", "Passengers remain at risk. A refusal with imminent risk changes your duty."],
      ["o", "Ask him to promise to call in sick tomorrow, and phone him in the morning to check that he did", "A promise from a man with suicidal thoughts is not enough to protect passengers."],
      ["b", "Tell him you must inform the aviation medical authority, then do so", "He is grounded and treated. Serious, imminent public risk justifies a limited, open disclosure."],
    ], "He has suicidal thoughts and flies a passenger plane."),
  ]),
  s("wy-g050", "boundaries", "Old notes and a court case", "ptsd", "ethics-law", 4, "UMDS", "Keep and share records carefully in court matters", "Your former client's divorce lawyer", [
    b("He asks you to write a letter saying your client's husband caused her PTSD.", [
      ["h", "Write the letter, since you believe her story", "You have only heard one side. A therapist is not an independent expert on who caused what."],
      ["b", "Say you can only share facts of treatment with her consent, not judge the husband", "You write a factual summary with her consent. Staying in your role keeps the evidence honest."],
      ["o", "Refuse to have anything at all to do with the court case, since therapy and courts should never mix", "She may need records she has a right to. Proper, factual help is part of your duty."],
    ]),
  ]),

  // A supervisor's misconduct
  s("wy-g051", "boundaries", "Supervisor dates a client", "therapies", "ethics-law", 4, "UMDS", "Act when a supervisor crosses a sexual boundary", "You are a trainee; your supervisor is seeing a client socially", [
    b("You see your supervisor and his current client holding hands at a café.", [
      ["o", "Mention it quietly to other trainees first to see whether they have noticed anything similar", "Gossip spreads but nothing changes, and the client stays at risk. Concerns need proper channels."],
      ["h", "Say nothing, since he controls your marks", "The client continues to be exploited. Fear is real, but silence leaves a vulnerable person at risk."],
      ["b", "Write down what you saw and raise it with the head of department or the ethics body", "An inquiry begins and the client is protected. Reporting through proper channels protects her and you."],
    ]),
  ]),
  s("wy-g052", "boundaries", "Supervisor asks you to backdate notes", "casesheet", "ethics-law", 5, "UMS", "Refuse to falsify records", "Your supervisor after a complaint is filed", [
    b("“Just add a note saying we did a risk assessment last month.”", [
      ["b", "Refuse calmly, and offer to write a dated note about what was missed", "The late note is honest and dated. Falsified records are a serious offence and fall apart under inquiry."],
      ["h", "Add the note, since he is in charge", "When the inquiry finds the backdating, you are also blamed. Following orders does not excuse falsifying records."],
      ["o", "Avoid him and hope it goes away", "He asks someone else to do it. Silence can leave others in trouble."],
    ]),
    b("He says you will not pass your placement if you refuse.", [
      ["o", "Add the note as asked, but keep your own private copy of what really happened, just in case", "You have still falsified the record. Keeping a secret copy does not undo it."],
      ["h", "Give in, since your career is at stake", "The inquiry finds two people falsified records. Threats do not make it right."],
      ["b", "Write down what he said and speak to the training coordinator", "The coordinator steps in and your placement is protected. Records of threats and proper channels protect trainees."],
    ], "You have refused once."),
  ]),
  s("wy-g053", "boundaries", "Supervisor drinks before clinics", "substance", "ethics-law", 5, "UMDS", "Respond to an impaired senior colleague", "Your consultant smells of alcohol before an afternoon clinic", [
    b("He is slurring slightly and about to see patients.", [
      ["b", "Tell him privately that you are worried and he should not see patients today", "He goes home and asks a colleague to cover. Speaking to him first is fast and respectful."],
      ["h", "Let him see patients, since it is not your place", "A patient gets a wrong prescription. An impaired clinician is a risk to patients right now."],
      ["o", "Cancel all his patients for the afternoon without speaking to him, to keep everyone safe quickly", "Patients are safe, but he is blindsided and the clinic is in chaos. Speak to him first if it is safe."],
    ]),
    b("It happens again the next week and he laughs it off.", [
      ["o", "Quietly cover his clinic yourself whenever he seems drunk, so patients are safe and he is not shamed", "You protect patients today, but the problem continues and you are now hiding it. Repeated impairment needs reporting."],
      ["b", "Report it to the head of department so he gets help and patients are safe", "He is referred to a support programme for doctors. Reporting a repeated problem helps him and protects patients."],
      ["h", "Tell the nurses to keep an eye on him", "Nobody is in charge and patients are still at risk. Informal watching is not a plan."],
    ], "He was sent home last time."),
  ]),
  s("wy-g054", "boundaries", "Supervisor takes credit for your research", "therapies", "ethics-law", 2, "CUS", "Raise authorship concerns properly", "Your supervisor removes your name from a paper", [
    b("You did the data collection and analysis.", [
      ["o", "Complain about him on social media so that other trainees are warned about what he does", "It harms your reputation as well as his, and the paper stays the same."],
      ["b", "Talk to him first with your records, and if needed take it to the research committee", "Your name is restored. Clear records and proper channels work."],
      ["h", "Accept it, since trainees have no voice", "Your work is lost and the pattern continues for others."],
    ]),
  ]),
  s("wy-g055", "boundaries", "Supervisor harasses you", "ptsd", "ethics-law", 5, "UMDS", "Seek help when a supervisor sexually harasses you", "You, a trainee at a hospital in Ahmedabad", [
    b("Your supervisor keeps commenting on your body and texting you at night.", [
      ["h", "Ignore it until the placement ends", "It escalates, and other trainees are harmed after you. Harassment rarely stops on its own."],
      ["o", "Confront him angrily in front of the whole team, so that everyone knows what he has been doing", "He denies it and the team is divided. A record and a formal route are safer."],
      ["b", "Save the messages, and take them to the workplace complaints committee", "An inquiry follows and you are moved to another supervisor. Every workplace in India with ten or more staff must have an internal complaints committee."],
    ]),
    b("The committee asks whether you want to continue the complaint, as it may affect your placement.", [
      ["b", "Continue, and ask for protection from retaliation", "The supervisor is disciplined and you complete training elsewhere. The process is meant to protect complainants."],
      ["h", "Withdraw it to protect your marks", "He continues with the next trainee. Withdrawing out of fear leaves others at risk."],
      ["o", "Ask the committee to give him only a quiet warning", "He feels untouchable and continues. A warning may not be enough."],
    ], "You have saved several messages."),
  ]),
  s("wy-g056", "boundaries", "Supervisor demands unpaid work", "therapies", "ethics-law", 1, "CUS", "Recognise exploitation in training", "Your supervisor asks you to run his private clinic on weekends for free", [
    b("He says it is “good experience”.", [
      ["b", "Thank him and decline unless it is part of your agreed training plan", "He finds someone else. Training should not become unpaid labour."],
      ["h", "Agree, since you need his reference", "You work every weekend with no supervision or pay. Fear of losing a reference is not consent."],
      ["o", "Agree once to keep him happy, then make polite excuses for later weekends", "It becomes awkward and the problem is not solved. A clear answer helps more."],
    ]),
  ]),

  // Students as friends
  s("wy-g057", "boundaries", "Classmate wants free therapy", "anxiety", "ethics-law", 1, "CUS", "Avoid acting as therapist to a friend", "Your MA classmate, panicking before exams", [
    b("“You're good at this. Can you do a proper therapy session with me?”", [
      ["h", "Agree and do weekly sessions in the hostel", "The friendship and the therapy both suffer. Friends cannot be your clients."],
      ["b", "Support her as a friend and help her book the college counsellor", "She gets proper help and keeps a friend. Each role stays clear."],
      ["o", "Tell her you are too busy", "She feels brushed off. You can still support her as a friend."],
    ]),
  ]),
  s("wy-g058", "boundaries", "Teaching assistant and a student", "therapies", "ethics-law", 3, "UMS", "Avoid romantic ties with students you assess", "You are a teaching assistant marking second-year essays", [
    b("A student you mark asks you out.", [
      ["o", "Say yes but keep it secret", "Others notice and question your marks. Secrecy does not remove the conflict."],
      ["h", "Say yes, since you are close in age", "Your marking is now in question and the student may feel unable to end it. Power gaps make these ties unsafe."],
      ["b", "Decline while you have any role in their marks or training", "The student understands. Power over grades makes the relationship unequal."],
    ]),
  ]),
  s("wy-g059", "boundaries", "Student confides suicidal thoughts in a teacher", "suicide", "ethics-law", 1, "CUS", "Respond as a teacher, not a therapist", "Riddhi, a student in your psychology class", [
    b("After class she says she has been thinking of ending her life.", [
      ["b", "Listen, take it seriously, and walk her to the college counsellor today", "She is seen the same day. A teacher's job is to connect her with care quickly."],
      ["o", "Offer to see her for therapy yourself after class, since she has already chosen to trust you", "You are her teacher, so the roles clash. A counsellor who does not mark her is better."],
      ["h", "Tell her to talk to you after exams", "Her risk does not wait for exams. Same-day help is needed."],
    ]),
  ]),
  s("wy-g060", "boundaries", "WhatsApp group with students", "therapies", "ethics-law", 1, "CUS", "Keep professional tone in student groups", "You teach a batch of MSc trainees", [
    b("Students add you to their batch group, which is full of jokes about patients.", [
      ["h", "Join in the jokes to fit in", "Screenshots leak and patients are identifiable. Joking about patients is disrespectful and risky."],
      ["o", "Leave the group quietly without any comment, so that you are not linked to what they post", "The jokes go on. A brief word about respect teaches more."],
      ["b", "Remind them that patient details never go in chats, and use it only for notices", "The jokes stop. Modelling good practice is part of teaching."],
    ]),
  ]),
  s("wy-g061", "boundaries", "Full case: friend becomes your trainee", "therapies", "ethics-law", 5, "UMS", "Manage a friendship when you become someone's supervisor", "Your close friend from college joins your clinic as your trainee", [
    b("She expects you to go easy on her assessments.", [
      ["b", "Talk openly about the two roles, and ask for a second assessor", "She agrees and the marks are fair. Naming the conflict and adding another view protects both."],
      ["o", "Ask another supervisor to secretly assess her work, so that the friendship is not affected", "She feels betrayed when she finds out. Open plans work better than secret ones."],
      ["h", "Pass her easily to keep the friendship", "A weak trainee is signed off. Patients are put at risk."],
    ]),
    b("She makes a serious error with a patient's risk plan.", [
      ["h", "Keep it between you to protect her career", "The patient remains at risk and you are both liable. Friendship cannot override safety."],
      ["b", "Address it directly, fix the plan, and record it through normal supervision", "The patient is safe and she learns from it. Fair process protects all."],
      ["o", "Fix the risk plan yourself and say nothing to her, so that she is not upset or embarrassed", "The patient is safe today, but she does not learn and may repeat it."],
    ], "You now have a second assessor in place."),
  ]),
  s("wy-g062", "boundaries", "Former student becomes a colleague", "therapies", "ethics-law", 2, "CUS", "Adjust to a new equal relationship", "Your former student is now a clinician on your team", [
    b("She still calls you “Ma'am” and defers to you in meetings.", [
      ["b", "Invite her to use your name and share her views as an equal", "She grows more confident in team decisions. Equal footing improves the team."],
      ["h", "Enjoy the respect and keep correcting her in front of others", "She feels small and stops contributing. Old power gaps should fade."],
      ["o", "Say nothing and let it change on its own", "It may never change. A small invitation helps."],
    ]),
  ]),

  // Payments
  s("wy-g063", "boundaries", "Client cannot pay", "depression", "ethics-law", 1, "CUS", "Discuss money openly and offer options", "Ajay, 29, lost his job, in therapy for depression", [
    b("“I don't think I can afford sessions anymore.”", [
      ["o", "Pause sessions until he finds work again, and tell him to call you when he can afford them", "He is left untreated at a hard time. Ending suddenly can raise risk."],
      ["h", "Let him keep coming for free without discussing it", "He feels guilty and stops coming anyway. Unspoken money issues fester."],
      ["b", "Talk openly about options: a lower fee, fewer sessions, or a free service", "He moves to a sliding-scale clinic and continues care. Honest talk about money keeps him in treatment."],
    ]),
  ]),
  s("wy-g064", "boundaries", "Barter offered", "therapies", "ethics-law", 5, "UMS", "Avoid barter that creates a second relationship", "A tailor who cannot pay offers to stitch clothes for your family", [
    b("He offers to sew for you in place of fees.", [
      ["b", "Thank him, decline barter, and find a fee he can manage or a free service", "He pays a small fee and keeps his dignity. Barter makes you his customer as well as his therapist."],
      ["h", "Agree and ask for some kurtas", "You are unhappy with a stitch and feel awkward. Barter mixes roles and can feel exploitative."],
      ["o", "Agree, but only for small items such as blouses, so the value stays close to your usual fee", "Even small barter creates a second role. A low fee is simpler."],
    ]),
    b("He insists, saying he feels ashamed to pay so little.", [
      ["b", "Say that a small fee is fair and his effort in therapy is what matters", "He feels respected and keeps coming. Taking away shame keeps him in care."],
      ["h", "Accept the barter to spare his feelings", "You become his customer and the roles blur. Kindness does not need barter."],
      ["o", "Raise his fee back to the usual level so that he feels he is paying properly", "He cannot afford it and drops out. Fees should match what he can pay."],
    ], "You declined barter and offered a lower fee."),
  ]),
  s("wy-g065", "boundaries", "Charging for missed sessions", "personality", "ethics-law", 2, "CUS", "Apply a missed-session policy fairly", "Rohan, 32, misses his third session without notice", [
    b("Your policy, signed at intake, says missed sessions are charged.", [
      ["o", "Waive the fee again quietly, since charging him might upset him and harm the relationship", "The pattern goes on, and you feel resentful. Clear limits are kinder long term."],
      ["b", "Remind him of the policy, charge as agreed, and explore the missed sessions", "He talks about avoidance. The fee is applied fairly and becomes part of the work."],
      ["h", "Charge him double this time as a warning, so that he takes the policy seriously", "He feels punished. Changing the agreed terms is unfair."],
    ]),
  ]),
  s("wy-g066", "boundaries", "Referral commissions", "antidepressants", "ethics-law", 4, "UMDS", "Refuse kickbacks for referrals", "A diagnostic lab offers you a cut for every patient you send", [
    b("They offer twenty per cent of each test fee.", [
      ["h", "Accept, since tests are needed anyway", "You send more tests than needed. Payment for referrals bends judgement and is unethical."],
      ["o", "Accept the offer, but put every rupee into the clinic's free service fund instead of your pocket", "The conflict remains wherever the money goes."],
      ["b", "Decline, and choose labs only by quality and patient cost", "Patients get only needed tests. Kickbacks are banned by medical ethics rules."],
    ]),
  ]),
  s("wy-g067", "boundaries", "Client offers stock tips", "bipolar", "ethics-law", 4, "UMDS", "Never use client information for personal gain", "Varun, 38, bipolar, works in finance", [
    b("During a hypomanic phase, he tells you about a company's unpublished deal.", [
      ["b", "Do not act on it, and focus on his mood and judgement", "You note his loss of caution as a sign of hypomania. Using what clients tell you for profit is a boundary violation."],
      ["h", "Buy shares, since he told you freely", "You have exploited his illness and may break insider trading law. This is a serious violation."],
      ["o", "Do not buy yourself, but pass the tip to a friend who invests", "Passing on what he said is a breach of confidentiality and still exploits him."],
    ]),
  ]),
  s("wy-g068", "boundaries", "Cash with no receipt", "therapies", "ethics-law", 1, "CUS", "Keep honest records of payments", "A client asks for a cheaper rate if she pays cash with no receipt", [
    b("“Give me a discount and I won't need a bill.”", [
      ["o", "Agree just this once, since she is struggling and it is only a small amount of money", "Once becomes routine. Unrecorded cash is still tax evasion."],
      ["h", "Agree, since it helps her", "You are hiding income and both of you are part of it. This breaks the law."],
      ["b", "Offer a lower fee if she needs one, always with a receipt", "She gets the discount honestly. Proper receipts protect both of you."],
    ]),
  ]),
  s("wy-g069", "boundaries", "Lending money to a client", "substance", "ethics-law", 3, "UMS", "Avoid lending money to clients", "Sachin, 26, in recovery, asks to borrow ₹5,000 for rent", [
    b("He says he will be thrown out tomorrow.", [
      ["h", "Lend it, since he is in crisis", "He does not repay and avoids sessions. Debt to a therapist damages the work."],
      ["b", "Decline kindly, and help him reach welfare, NGO or family support", "A local NGO helps with rent. Linking him to real support is safer than becoming his lender."],
      ["o", "Give him the money as a gift instead of a loan, so that there is no debt hanging over the therapy", "He asks again next month. Gifts of money still change the relationship."],
    ]),
  ]),
  s("wy-g070", "boundaries", "Full case: a fee dispute and a complaint", "personality", "ethics-law", 5, "UMDS", "Resolve a fee dispute without breaching confidentiality", "Anjali, 41, ended therapy angry, owes three months of fees", [
    b("She refuses to pay and says therapy did not help.", [
      ["o", "Write the whole debt off and say nothing, since chasing money from a former client looks bad", "You avoid conflict but feel resentful, and nothing is learned. A calm letter is reasonable."],
      ["h", "Tell her you will share her diagnosis with a debt agency", "You have threatened a breach of confidentiality. Debt collection can never reveal clinical details."],
      ["b", "Send a calm letter stating the fees owed, and offer a payment plan", "She agrees to pay in parts. Calm, private contact keeps it fair."],
    ]),
    b("She replies that she will complain to the professional body about your fees.", [
      ["b", "Stay calm, keep good records, and cooperate with any process", "The body finds your fees were agreed and fair. Good records are the best defence."],
      ["h", "Post online about how unfair she is being", "You breach her privacy in public. Arguing online is never acceptable."],
      ["o", "Drop all the fees at once and tell her so, to avoid a complaint and any damage to your name", "You give up a fair claim out of fear and she may complain anyway."],
    ], "You have a signed fee agreement from her first session."),
  ]),

  // Online and telehealth limits
  s("wy-g071", "boundaries", "Video session from a shared room", "interview", "ethics-law", 1, "CUS", "Check privacy before an online session", "Ritu, 24, joins a video session from her family's living room", [
    b("You can hear her mother in the background.", [
      ["b", "Ask if she can talk freely, and offer to move, use headphones or reschedule", "She moves to the terrace with earphones. Privacy checks come first."],
      ["h", "Start as usual and ask about her family problems", "Her mother overhears and is upset. Online privacy has to be checked, not assumed."],
      ["o", "Ask her mother politely, through the screen, to leave the room for the next hour", "Her mother is offended and Ritu is embarrassed. Ask Ritu what she wants."],
    ]),
  ]),
  s("wy-g072", "boundaries", "Client in another country", "anxiety", "ethics-law", 5, "UMS", "Check where a telehealth client is and what applies", "Former client moves to Dubai and wants to continue online", [
    b("He asks to keep seeing you weekly from there.", [
      ["b", "Check what rules apply where he lives, and plan local emergency contacts", "You find out what is allowed and set an emergency plan in Dubai. Telehealth across borders needs checks."],
      ["h", "Carry on as before without any checks", "In a crisis you have no idea whom to call. Distance changes your safety plan."],
      ["o", "Refuse to continue, since therapy with anyone abroad is never allowed for an Indian clinician", "He loses care that may be allowed. Find out first."],
    ]),
    b("Three months later he has a panic attack and says he wants to die, during a session from Dubai.", [
      ["o", "Tell him to go to the nearest hospital straight away and end the call so he can get moving", "You do not know if he goes. Stay on the line while help is arranged."],
      ["h", "Tell him to call you back when he feels better", "You lose contact at a risky moment. Act now."],
      ["b", "Use the local emergency contacts you agreed earlier, and stay on the call", "His friend reaches him and he is assessed locally. The plan made at the start pays off."],
    ], "You set up local contacts in Dubai at the start."),
  ]),
  s("wy-g073", "boundaries", "Crisis during a video call", "suicide", "ethics-law", 5, "UMDS", "Manage acute risk during telehealth", "Shruti, 30, video session, says she has taken pills", [
    b("She says she has just swallowed a strip of sleeping pills and is alone.", [
      ["o", "Tell her to go to the hospital and end the call", "She may not go, and you lose contact. Stay connected while help is sent."],
      ["b", "Stay on the call, confirm where she is, and get emergency help sent", "An ambulance reaches her in time. Knowing her location and emergency contact beforehand saves her."],
      ["h", "Tell her to sleep it off and call tomorrow", "She could die. An overdose is a medical emergency."],
    ]),
    b("The call drops while you are waiting.", [
      ["h", "Wait for her to call back", "Minutes are lost. You must act on what you know."],
      ["o", "Keep calling her phone and messaging her until she answers, since she may just have lost signal", "She may be unconscious. Use the emergency contacts too."],
      ["b", "Call the ambulance and her contact with her address, and keep calling her", "Her brother reaches her first. Clear plans made at the start of online work make this possible."],
    ], "You have her address and her brother's number from intake."),
  ]),
  s("wy-g074", "boundaries", "Recording sessions", "interview", "ethics-law", 2, "CUS", "Get consent before recording", "You want to record online sessions for supervision", [
    b("Your client does not know about the recording.", [
      ["h", "Record anyway, since it is for training", "She finds out and feels betrayed. Recording without consent is a breach."],
      ["o", "Record it, but delete it as soon as your supervisor has watched it, so no copy is kept", "She still did not agree. Consent comes first."],
      ["b", "Explain why, ask for written consent, and tell her she can say no", "She agrees, knowing she can stop it. Clear consent makes recording fair."],
    ]),
  ]),
  s("wy-g075", "boundaries", "Client records you secretly", "personality", "ethics-law", 4, "UMS", "Respond calmly when a client records sessions", "Sameer, 35, posts a clip of your session online", [
    b("You did not know he was recording.", [
      ["b", "Raise it calmly in session, agree rules, and seek advice about the clip", "He takes it down and you agree on recording rules. Calm limits help more than anger."],
      ["h", "End therapy at once by message", "He feels attacked and posts more. Abrupt endings escalate conflict."],
      ["o", "Say nothing about it and hope that very few people ever see the clip before it is forgotten", "It spreads and you lose control. Address it early."],
    ]),
  ]),
  s("wy-g076", "boundaries", "Therapy on a messaging app", "therapies", "ethics-law", 2, "CUS", "Choose safe tools for online work", "A client wants sessions by chat on a social app", [
    b("She prefers text to video.", [
      ["o", "Use the social app anyway, since she is comfortable there and comfort helps her talk", "Messages stay on her shared phone. Use secure tools for therapy."],
      ["b", "Offer a secure platform, and agree what text can and cannot be used for", "She uses a secure chat and feels safe. The right tool protects privacy."],
      ["h", "Refuse all text-based work", "She drops out. Text can work with the right setup."],
    ]),
  ]),
  s("wy-g077", "boundaries", "Telehealth with a child", "child", "ethics-law", 5, "UMS", "Plan safe online sessions with a child", "Aarav, 10, anxiety, sessions on video", [
    b("He keeps walking off camera to play.", [
      ["h", "Tell his mother to make him sit still", "He resists more. Online work with children needs a different style."],
      ["o", "Pause online sessions until he is able to come into the clinic in person every week", "He loses help for months. Many children can manage online with changes."],
      ["b", "Use shorter, more active sessions, games on screen and a parent nearby", "He stays engaged. Adapting the format makes online work possible."],
    ]),
    b("He says something worrying about his uncle while his mother is out of the room.", [
      ["b", "Stay calm, ask simple open questions, and plan to protect him under the law", "He says more and you report under POCSO. Online sessions carry the same duty to protect."],
      ["o", "Ask him to tell you more about his uncle next time, when his mother is in the room as well", "The moment passes and he may not repeat it. Listen now."],
      ["h", "Ask his mother to come back and tell her what he said, in front of him", "He goes quiet and may face pressure at home. Handle disclosures carefully."],
    ], "His mother usually sits in the next room."),
  ]),
  s("wy-g078", "boundaries", "Full case: online therapy and identity", "dsm-personality", "ethics-law", 5, "UMS", "Verify identity and keep safety in online-only work", "A client books online therapy with only a first name", [
    b("She will not give a full name, address or emergency contact.", [
      ["o", "Start anyway without those details, since her wish for privacy should come first in online work", "If she is at risk, you have no way to help. Basic safety details are needed."],
      ["h", "Refuse and end the call", "She feels judged and may not seek help elsewhere. Explain the reason first."],
      ["b", "Explain why you need location and an emergency contact, and agree what stays private", "She shares her city and a friend's number. Explaining the reason builds trust."],
    ]),
    b("In the third session she says she is a doctor and wants you to keep it from her employer.", [
      ["h", "Assure her that nothing ever leaves the session", "If she is at risk to patients, you may have to act. Absolute promises are unsafe."],
      ["b", "Reassure her that you protect her privacy, and explain the rare limits again", "She feels safe and stays. Reminding her of the limits keeps trust honest."],
      ["o", "Ask her for proof that she is a doctor before you continue, such as her registration number", "She feels mistrusted. Her job only matters if risk appears."],
    ], "She has agreed to share her city and an emergency contact."),
  ]),
  s("wy-g079", "boundaries", "Prescribing over a video call", "antidepressants", "ethics-law", 5, "UMDS", "Know the limits of online prescribing", "A psychiatrist on a telehealth platform", [
    b("A new patient on video wants alprazolam, saying a friend's doctor gave it.", [
      ["b", "Assess her fully and offer safer first-line options, explaining why", "She starts an SSRI and therapy. Careful first steps protect her."],
      ["h", "Prescribe, since she is anxious and asking", "Benzodiazepines carry a risk of dependence, and a first online visit is not the place to start them."],
      ["o", "Refuse, explain that you never prescribe it, and end the call", "She feels rejected and may buy it without a prescription. Explain and offer help."],
    ]),
    b("She returns asking for a stronger dose by chat.", [
      ["o", "Increase it by chat, since you know her now", "Changing medicines without a review misses side effects and risk."],
      ["b", "Book a video review before any change", "You find she has started drinking and adjust the plan. A proper review is safer."],
      ["h", "Tell her to double the dose herself", "She becomes very drowsy and falls. Doses must be set by the prescriber after review."],
    ], "She has been on an SSRI for a month."),
  ]),
  s("wy-g080", "boundaries", "Full case: a client finds you on a dating app", "therapies", "ethics-law", 5, "UMDS", "Handle an accidental match with a client", "You see your current client's profile on a dating app", [
    b("The app shows you have both swiped right.", [
      ["h", "Message him to clear the air", "You have turned a slip into contact outside therapy. Keep it in session."],
      ["b", "Unmatch, and raise it briefly in the next session", "He is relieved you named it. Brief, open handling keeps it professional."],
      ["o", "Unmatch and never mention it, so that neither of you has to feel embarrassed", "He wonders if you saw and the silence grows. A brief word helps."],
    ]),
    b("He says he is glad, because he likes you and would like to date.", [
      ["o", "Say you are flattered, and that you will think about it once therapy has ended", "He hopes, and the therapy drifts. Your answer must be clear."],
      ["h", "End therapy so you can date him", "This is exploitation of the power you hold. Ending therapy to date a client is a serious violation."],
      ["b", "Say clearly that this cannot happen and explore what it means to him", "He feels embarrassed but stays. Clear limits plus warmth keep therapy safe."],
    ], "You raised the match at the start of the session."),
  ]),
];
