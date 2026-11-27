# How the order flow would work (design, not built)

Pages in this folder (all placeholders, nothing connected):
index.html (offers) > diagnostic.html (step 1: brand details) > checkout.html (step 2: scan QR and pay)
> status.html (step 3: report; sample layout with made-up data) and book-research.html (Rs 1,599 order).

## Lowest-cost setup
Hosting: Cloudflare Pages free plan (Rs 0).
Form + order handling: one Cloudflare Pages Function (free plan: 100,000 requests a day across Workers).
Order storage: Cloudflare D1 or KV free tier (limits to be checked when set up) or, simplest, orders emailed to the owner.
AI: one API call per paid order. Secret keys live as encrypted environment variables in Cloudflare, never in index.html or style.css.

## Her choice: a payment-link QR
She creates a payment link for Rs 19 (and one for Rs 1,599) in a payment provider dashboard. The QR is that link as a picture.
- Phones cannot scan their own screen, so the page also shows a tap-to-pay button with the same link.
- One fixed link and QR is shared by all customers, so the provider does not know which brand paid. The page therefore asks for
  the payment ID after paying, or the provider's payment-link form collects the customer's email so it can be matched to the order.
- Fully automatic release (webhook) needs a provider that sends payment events to a small free function; manual matching needs none.

## Two ways to do the QR step
A. Manual (Rs 0 fees): a static UPI QR for a business or merchant UPI ID. Customer pays, types the UPI reference number.
   Owner checks the bank or UPI app, then triggers the report. Needs no gateway account. Not automatic, and
   using a personal UPI ID for business may break the bank or UPI app terms (not verified).
B. Automatic: a payment gateway makes a UPI QR or payment link per order and confirms payment to the site
   by webhook; the site then runs the AI and releases the report. Needs a merchant account with KYC.
   Published fees (checked 27 Nov 2026): Razorpay 2% per transaction + GST, no setup fee; Cashfree 1.95%,
   with a 0% platform fee offer for new merchants up to Rs 20 lakh sales until 31 Mar 2027; Instamojo 2% + Rs 3 + GST.
   Whether each gateway offers a QR product and what its onboarding needs: to be checked before choosing.

## AI cost per diagnostic (estimate)
Gemini 3.8 Flash list price: USD 0.75 per 1M input tokens and USD 3.75 per 1M output tokens until 31 Dec 2026,
USD 1.50 and USD 7.50 from 1 Jan 2027. A diagnostic of about 8,000 tokens in and 2,000 out is roughly
USD 0.014 now, USD 0.027 from January: about Rs 1 to Rs 2.50 (exchange rate assumed, not checked).
A free tier exists but Google may use free-tier data. Web search or scraping, if added, costs extra.

The Step 1 form includes a plan section (3 to 6 month goal, new products, where to sell, budget). It goes into the AI prompt so scores, warnings and questions are judged against the owner plan.

## One short form for both stages
Step 1 follows a short "60 second" shape: category, stage (idea, making samples, ready to launch, selling), what are you making, what need it meets, target buyer, number 1 worry (each with example text and a character minimum), then optional sections for competitors and differentiation, links and reviews (if already selling), and the 3 to 6 month plan.
Draft auto-save would use the browser's local storage (free, nothing sent). The AI prompt changes with the stage. Both reports name competitors and differentiation, and say the AI cannot verify demand.

## Report contents (from her voice note)
From what the owner enters, the AI reports: who they can target (best-fit buyer groups and where to reach them, versus who they said they sell to), who their competitors are and what those competitors are doing (buyer, price, channel, message), and how the owner differs.

## Step 4: reach out
After the report, the owner can tick "contact me about the Rs 1,599 plan" (Step 1) or press "Yes, contact me" on the report page. She then messages them herself. The form's actual-problem answer is shown to her so she can open with it.

## Limits to be honest about
The AI cannot reliably read Instagram or marketplaces by itself. The form asks the owner to paste reviews and
links so the report uses real text. Scores must be explained as AI opinions, not measurements.
