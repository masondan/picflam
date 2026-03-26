I need a fresh pair of eyes and some creative thinking on this problem. I created PicFlam, a mobile-first, non-commercial app used to help train journalists in AI.
It has AI background removal, upscaling and image generation, as well as a simple canva-style designer and image crop/edit tool

I have just introduced styles into image generation - works fine. And have been trying to introduce, through an API, the option to upload a reference photo.

The storytelling objective is to have a series of images with a consistent character in different environments. Simple example: 1. Scientist frustrated in the lab after yet another failed experiment. 2. Same scientist celebrating in the pub after a breakthrough success.
I need the same output as those many AI websites where you can upload a picture of yourself and say 'turn this person into a medieval warrior'.

Using AI agents as lead coder, we've tried several approaches with, generally, disastrous results. A summary of approaches tried is below:

Objective: Allow journalists to upload a reference photo of a person, then generate new images placing that person in different scenes/poses/environments while preserving their facial identity. Use case: creating consistent character across a photo carousel (e.g., same scientist in lab → conference → celebration).

Platform: Runware API (v1), FLUX-based models, Cloudflare Worker backend.

What was tried:

FLUX Redux (runware:105@1 as IP-Adapter)
ipAdapters with guideImage
- Prompt completely ignored. Only produced slight variations of the original image — same pose, same background, just face-swapped

ACE++ subject (runware:102@1)
type: 'subject', strength: 0.6
Scene changed correctly but faces bore zero resemblance to reference

ACE++ portrait (runware:102@1)
type: 'portrait', no strength set (default)
Single person output, no resemblance

ACE++ portrait
type: 'portrait', strength: 0.8
Scene correct, faces completely different people

ACE++ portrait
type: 'portrait', strength: 0.85, faceMode: true
Testing now

PuLID (runware:101@1)
puLID.inputImages
Generated correct scene but faces didn't match reference at all

Core problem: No Runware/FLUX combination tested reliably preserves facial identity from a reference image while allowing prompt-driven scene changes. Redux locks composition, ACE++ loses faces, PuLID ignores identity.

System prompt wrapping was also tried (prepending identity-preservation instructions) — made results worse per expert advice that diffusion models aren't LLMs and long instructions cause over-anchoring to the reference.

Current code state: Clean — raw user prompt + reference image sent directly to Runware API, no wrappers.

--

I am also now reading about 'identity blocks'. But am not sure this is the solution:
How "Superhero" Apps Actually Do It
The professional apps you see don't rely on a magic prompt. They use Prompt Segregation and Weighting. 

Here is how you can replicate that "consistent hero" effect without a LoRA:
1. Use "Compel" Weighting (Syntax)
Runware and FLUX support weighting. Instead of a System Prompt, use mathematical weights in your positive prompt to tell the AI exactly what to care about.
Format: (word)weight (e.g., 1.2 for more focus, 0.8 for less).
2. The "Identity Block" Method
Professional workflows use a "Fixed Identity Block" at the start of every prompt, followed by the "Variable Scene."
Instead of a System Prompt, use this structure in your code:
JavaScript
const identityBlock = "(the specific man and woman from the reference image:1.3), (exact facial features:1.2), (photorealistic:1.1),";
const sceneBlock = "dancing a waltz in a 19th-century Viennese ballroom, wearing silk gowns and tailcoats, cinematic lighting";
positivePrompt: `${identityBlock} ${sceneBlock}`

--

The big question: Is there a simple, low-cost, off the shelf solution out there that will work? Or do I just remove the functionality from the app and move on?

--

Having read more, I'm not convinced by the Identity Block method. This seems to sum up the best I can find:
"Before removing the feature, do one more targeted test: Runware's InstantID implementation (runware:103@1 or check their current model list — it may have been added after your testing). InstantID was specifically designed to solve the problem you're describing and is architecturally different from IP-Adapter/Redux. If that fails with the same result, you have your answer.
If InstantID fails → fal.ai Photomaker as a single-feature swap is your best remaining option without a major rebuild.
If both fail → remove the feature gracefully. The "carousel with consistent character" concept is genuinely at the frontier of what these models do reliably. Framing its absence honestly to your users ("this is a hard problem even for the best AI systems") is itself a good journalism lesson.
The identity block approach: skip it. It's real syntax, but it's solving a different problem (style/aesthetic consistency across prompts, not facial identity preservation). It will not get you to "same scientist" reliability."

I also see PhotoMaker API on Runware: https://runware.ai/docs/image-inference/photomaker#key-features
Could this be worth a try?

--

Weigh in with your expert opinion