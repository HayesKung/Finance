/** 英文对照。条目顺序和 id 与 copy.ts 一致。价格仍是人民币，不换算。 */

export const products = [
  {
    id: "A",
    name: "Export finance pack",
    who: "Exporters, per shipment or per month. Building materials, equipment, steel, scaffolding, windows, precast.",
    deliver: "A document checklist, a receipt reconciliation, a rebate file, and FX risk notes.",
    price: "CNY 1,500–4,000 per shipment; CNY 6,000–15,000 per month",
    note: "Use this first to fund the practice. A suggested starting price, not a checked market rate.",
  },
  {
    id: "B",
    name: "Overseas project retainer",
    who: "Smaller contractors, labor firms and material suppliers on work in Southeast Asia, the Middle East, Central Asia or Africa.",
    deliver: "A project budget, a cash plan, progress-billing tracking, a monthly pack, and a collections warning.",
    price: "CNY 12,000–30,000 per month, adjusted for size and volume",
    note: "Three to six months to start, this month prepaid. The highest fee of the three.",
  },
  {
    id: "C",
    name: "Settlement and collections",
    who: "Construction firms in China that still have a retention or a settlement dispute.",
    deliver: "A negotiable settlement basis, after the contract, variations, statements, invoices and payments are lined up.",
    price: "A fixed fee plus milestone fees, set per project",
    note: "Financial sorting and evidence only. A pure percentage of collections is not recommended.",
  },
];

export const flow = [
  "A free 30-minute diagnosis (a risk list only)",
  "A paid proposal and a model",
  "Sign, and collect in advance",
  "Deliver monthly, or per shipment",
  "A monthly review and a collections warning",
];

export const wontDo = [
  "We do not touch the client's money. Receipts and payments stay in the client's own bank accounts.",
  "No advance of funds, no equity in the project, no bridge financing.",
  "No promise of a rebate amount, a loan size, or a collection result.",
  "No FX forecast. Rebate and compliance conclusions follow the real documents. A licensed accountant or lawyer reviews anything in dispute.",
  "Work that needs a bookkeeping license is done only with that license, or with a licensed firm. Do not take it unlicensed.",
  "Outside contact, quotes and signatures are in the finance principal's own name. Lists, scripts, drafts and tracking do not replace that contact.",
];

export const gates = [
  "Take a 50% deposit before work. Monthly work is prepaid for the month. The balance is cleared before delivery.",
  "Client files are under a confidentiality agreement, stored per project, not mixed and not forwarded.",
  "Publish only masked material. Do not show real documents or a client's private details.",
  "Do not buy an illegal list, scrape private contacts, or spam.",
  "A private phone or WeChat is recorded only after they agree to exchange it.",
  "Do not accept “do it first, and pay if it works”.",
  "Decline a job when the file is incomplete or the work is outside the license and the skill. Introduce the rest to a licensed firm.",
  "Do not spend on a domain, a booth, paid ads or paid tools before that spend is approved.",
];

export const audiences = [
  "Exporters of building materials, equipment, steel, windows, precast and the like",
  "Smaller contractors on work in Southeast Asia, the Middle East, Central Asia or Africa",
  "Labor firms and material suppliers that follow work overseas",
  "Construction firms in China that still need the evidence for a retention or a settlement dispute lined up",
];

export const capabilities: [string, string][] = [
  ["Job costing and budget control", "Overseas project costing, and cost control while the job is open"],
  ["Settlement, progress payments, variations and claims", "Settlement review, financial support on a claim, collections tracking"],
  ["Cash plans, financing and receivables", "A project cash model, the rhythm of collections, and talks on payment terms"],
  ["Trade receipts, documents and rebates", "Checks of TT / LC / DP documents, receipt matching, and the export-rebate file"],
  ["FX, credit insurance and cross-border tax", "An FX risk framework, a handoff to export credit insurance, and the cross-border tax points"],
];

export const questionGroups = [
  {
    title: "The firm and the work",
    items: [
      { id: "q1", text: "Main product or type of work, and roughly the last year's exports or overseas contract value" },
      { id: "q2", text: "Main countries and the type of customer (main contractor, subcontractor, end buyer, trader)" },
      { id: "q3", text: "Who does the finance now, and is the bookkeeping in-house or outsourced" },
      { id: "q4", text: "The last time a finance problem lost an order, delayed a receipt, or caused a deduction" },
    ],
  },
  {
    title: "Receipts and documents",
    items: [
      { id: "q5", text: "How the mix splits across TT, LC, DP and OA, and how long the terms run" },
      { id: "q6", text: "Any discrepant documents, an LC refusal, or a late receipt, and why" },
      { id: "q7", text: "Who matches receipts, and whether each bank credit ties to a contract and an invoice" },
    ],
  },
  {
    title: "Rebates and tax",
    items: [
      { id: "q8", text: "Whether the export rebate is filed in-house or outsourced, how long it takes, and whether a filing was sent back" },
      { id: "q9", text: "Whether the documents, the customs form, the invoice and the receipt record are complete and consistent" },
      { id: "q10", text: "Whether anyone has listed the cross-border tax points (a permanent establishment, withholding, transfer pricing)" },
    ],
  },
  {
    title: "FX and cash",
    items: [
      { id: "q11", text: "Whether the quote currency and the settlement currency match, and whether there is an FX warning line" },
      { id: "q12", text: "Whether forwards, options or credit insurance have been used, and why not if they have not" },
      { id: "q13", text: "Whether the project cash plan rolls monthly, and how early a gap is usually seen" },
    ],
  },
  {
    title: "Settlement and collections (ask every construction or project client)",
    items: [
      { id: "q14", text: "Which milestones release a progress payment, and whether variations are confirmed in time" },
      { id: "q15", text: "The retention ratio and the release conditions, and how long the oldest balance has been open" },
      { id: "q16", text: "Whether the contract, variations, statements, invoices and payments can be matched line by line" },
    ],
  },
  {
    title: "Process and files",
    items: [
      { id: "q17", text: "Whether files live in WeChat, email, or a fixed archive, and how long an old document takes to find" },
      { id: "q18", text: "Whether there is confidentiality and access control, and whether project files are stored apart" },
    ],
  },
];

export const closeScript =
  "These 30 minutes are only to list the risks for you. The full method, the model and the execution list are in the paid proposal, and they are delivered after you sign. Do you want to start with the export finance pack, or with one overseas project on retainer?";

export const scripts = [
  {
    scene: "老关系",
    text: "I have been helping exporters and firms with overseas projects sort out the finance, mainly collections, settlement, documents and rebates. Could we take 30 minutes for a free diagnosis? I will only list the risks. I am not selling, and a full proposal is a separate conversation.",
  },
  {
    scene: "转介绍",
    text: "[Referrer] suggested I call. They said the [export / overseas project] work has taken a lot of time on [collections / documents / settlement]. Could we take 30 minutes for a diagnosis? A risk list first, and then we see whether a paid proposal is useful.",
  },
  {
    scene: "内容来询",
    text: "Thank you for reading [topic]. Is your side export, or an overseas project? Could we take 30 minutes for a diagnosis? I will list the risks on that piece first, and then you can decide on a proposal.",
  },
];

export const partnerLine =
  "We do the finance for overseas projects and exporters: collections, settlement, documents and rebates. If you have a client on an export or an overseas job who is stuck on a receipt or a document, book a free diagnosis. We give only a risk list. A referral fee, or an exchange of clients, is settled under an agreement after a sale. The rate and the terms are written into the agreement before anyone signs. Do not promise them verbally.";

export const channels = [
  {
    rank: "First",
    name: "Existing relationships",
    how: "List the old suppliers, subcontractors, material vendors, main contractors and owners. Invite them one by one. Start with the 20 who know you best.",
    goal: "Book 20 free diagnoses, close 2 pilots",
  },
  {
    rank: "Second",
    name: "Partner referrals",
    how: "Ask customs brokers, forwarders, tax firms, law firms and bank relationship managers. Sign a short cooperation note and refer both ways. Give each partner a one-page explanation.",
    goal: "3–5 partners in conversation",
  },
  {
    rank: "Third",
    name: "Trade groups, chambers and fairs",
    how: "Join groups and chambers in construction, import-export and cross-border trade. Attend the Canton Fair, building-material fairs and cross-border fairs. On site, only book a diagnosis. Do not quote or sign there.",
    goal: "10 diagnoses booked per fair",
  },
  {
    rank: "Fourth",
    name: "Content",
    how: "Two masked pieces a week. Frameworks and risk points only. No FX forecast, no client privacy, no real documents.",
    goal: "2 pieces a week, for 12 weeks",
  },
];

export const topics = [
  "Where overseas collections fail: the step that stalls a progress payment, a variation or a retention",
  "Common LC refusals: 10 frequent discrepancies, and how to check them yourself",
  "An export-rebate checklist: how to test that the customs form, the invoice and the receipt are the same shipment",
  "How to set an FX warning line: what to record at quote, at signature and at receipt",
  "How to talk about TT and OA terms: tenor, advance and credit insurance as one set",
  "A cash plan for an overseas project: the smallest monthly roll-forward that is usable",
  "Why a variation is so hard to confirm: the join between the variation and the settlement, from the finance side",
  "Retention and final balances: how to age them, and which step the chase starts on",
  "Cross-border tax points: common mistakes on a permanent establishment and on withholding",
  "An export document checklist: what to match from the order to the receipt",
  "A smaller contractor's first overseas job: five finance items that are easy to miss",
  "A material supplier's export quote: where to leave room for FX and freight",
];

export const seoDirections: { direction: string; titles: [string, string] }[] = [
  {
    direction: "Overseas collections",
    titles: [
      "A collections check: which three files to read when the progress-payment milestone is vague",
      "Financial signals that a project receipt is slipping: age, variations and retention, read apart",
    ],
  },
  {
    direction: "Settlement and variations",
    titles: [
      "The variation is not confirmed, so the settlement basis will not tie",
      "A change, from the finance side: the unsigned paper is the one you will not collect",
    ],
  },
  {
    direction: "Retention and final balances",
    titles: [
      "A retention-release check: start date, ratio and defects liability, lined up",
      "The smallest aging of a final balance: separate what is due from what is not yet earned",
    ],
  },
  {
    direction: "Letters of credit",
    titles: [
      "Before you present under an LC: ten frequent discrepancies to tick off",
      "How to see a soft clause: can you present this document without the buyer",
    ],
  },
  {
    direction: "Rebate files",
    titles: [
      "A rebate-file check: where to look first when the customs form, invoice and receipt disagree",
      "After a rebate filing is sent back: which paper to add, not how much you hope to receive",
    ],
  },
  {
    direction: "Receipt matching",
    titles: [
      "A TT receipt sheet: bank credit, contract and invoice, one line at a time",
      "From order to receipt: the shortest list of papers to keep",
    ],
  },
  {
    direction: "FX risk framework",
    titles: [
      "Quote, signature, receipt: what the FX warning line records at each point",
      "When the quote currency and the settlement currency differ, which column holds the buffer",
    ],
  },
  {
    direction: "Export credit insurance",
    titles: [
      "An export on open account, with no credit insurance yet: look at the tenor and the buyer, not the product name",
      "OA tenor, the advance and credit insurance, on one conditions sheet",
    ],
  },
  {
    direction: "Project cash plan",
    titles: [
      "A cash plan for an overseas project: the smallest monthly columns",
      "The gap is always noticed late: write the lead time into the monthly cash sheet",
    ],
  },
  {
    direction: "Smaller contractors overseas",
    titles: [
      "A smaller contractor's first overseas job: five finance items that are easy to miss",
      "A material supplier following a project overseas: freight and tenor get separate buffers in the quote",
    ],
  },
];

export const weeks = [
  {
    week: "Week 1",
    content: "Topic 1, where collections fail; topic 2, an LC refusal check",
    qa: "What to do when a progress milestone is unclear; the three most common discrepancies",
    outreach: "Send 10 diagnosis invitations to existing relationships",
    partner: "Speak to 1 customs broker or forwarder",
  },
  {
    week: "Week 2",
    content: "Topic 3, three documents that must match; topic 4, an FX warning line",
    qa: "Which document to fix first when the three do not match; how to record two currencies",
    outreach: "Invite 10 more, and write why the ones that did not book",
    partner: "Speak to 1 tax firm or law firm",
  },
  {
    week: "Week 3",
    content: "Topic 5, how to talk about terms; topic 6, the smallest cash-plan template",
    qa: "How OA tenor and an advance sit together; how early a cash gap has to be seen",
    outreach: "Review the booked diagnoses, and add a second 10",
    partner: "Send the one-page referral note to the partners already in conversation",
  },
  {
    week: "Week 4",
    content: "Topic 7, confirming a variation; topic 8, retention and final balances",
    qa: "Can an unsigned variation enter the settlement basis; why retention and the final balance are aged apart",
    outreach: "Follow only the leads you have. Do not start a new blast",
    partner: "Review whether a partner will exchange referrals. Do not promise a fee that is not agreed",
  },
];

export const funnelMetrics = [
  "New public leads",
  "Invitations sent",
  "Diagnoses booked",
  "Risk lists issued",
  "Quotes opened",
];

export const rhythm = [
  {
    phase: "Prepare",
    time: "Days 1–7",
    do: "Fix a one-page offer. Prepare the templates: overseas project model, export document checklist, collections tracker, diagnosis report.",
    done: "The offer can be sent. The templates are complete. The contact line is still filled by the principal before anything goes out.",
  },
  {
    phase: "Pilot",
    time: "Days 8–30",
    do: "List 100 targets. Book 20 free diagnoses from existing relationships first. A pilot may be cheap, but it has to earn a masked case and a client comment you are allowed to show.",
    done: "2 pilots closed. A case is not published before the client agrees.",
  },
  {
    phase: "Standardize",
    time: "Days 31–60",
    do: "Turn the pilot into a standard process and start charging the monthly retainer. Publish on a steady weekly rhythm. Talk to 3–5 referral partners.",
    done: "Monthly retainer fees start to arrive.",
  },
  {
    phase: "Select and raise the price",
    time: "Days 61–90",
    do: "Raise the price and select. Take only files that are complete, from clients who will pay.",
    done: "3–5 steady monthly clients, plus a continuing export volume.",
  },
];

export const firstWeek = [
  "Confirm the name, the contact and the price range on the offer. Until the contact is set, the offer stays internal.",
  "Check the 7 templates: overseas model, document checklist, collections tracker, diagnosis report, monthly pack, contract points, case review.",
  "List existing relationships, circle the 20 closest, and write the invitation. Public fields only.",
  "The finance principal sends the first 10 diagnosis invitations and logs the result. If they do not book, write why.",
  "Contact 3 partners (broker, forwarder, tax firm, law firm or bank). A referral fee is not promised before it is in an agreement.",
  "Pick 1 of the 3 drafts already written and check the masking. Do not send it before that check.",
  "Review the week's outreach and partners, update the tracker, and name the next 10.",
];

export const articles: { id: string; title: string; topic: number; body: string }[] = [
  {
    id: "a1",
    topic: 1,
    title: "Where an overseas collection fails: progress payment, variation, or retention",
    body: `This is a check you can run yourself. It does not decide whether one balance can be collected, and it does not promise a result.

Money on an overseas project is rarely settled in one sum at the end. It usually sticks in one of three places: the progress-payment milestone, the confirmation of a variation, or the conditions on a retention. If the three are mixed on one statement, nothing ties later.

1. Progress payments
Copy the payment milestones out of the contract: physical progress, arrival, installation, acceptance, handover. For each, write the percentage, who signs, and how many days until payment. A milestone that lives only in the quote, and not in the payment clause, is not a receivable that has fallen due. In the check, keep two columns: due under the contract, and papers not yet complete.

2. Variations
Work that was done, with a variation that was never signed, does not go into the settlement basis. Finance needs one alignment sheet: what changed, the date it was raised, who confirmed it, whether it is priced, and whether it is in this period's statement. With no confirming person, mark it “not confirmed”. Do not fold it into revenue or receivables to make the report look tidy.

3. Retention
List the ratio, the start date, the release conditions and the defects liability on their own lines. Retention is not an ordinary final balance. A final balance may mean the settlement is unfinished. Retention means a condition is not yet met. Age them apart, or the chase goes to the wrong item.

4. Can five sets of papers be matched line by line
Contract, variations, statements, invoices, payment records. A line that does not tie is a risk, not a paragraph. The diagnosis only lists the lines that do not tie. How to negotiate, and how to complete the evidence, belongs in the paid proposal.

The full method, the model and the execution list are not part of the free diagnosis.`,
  },
  {
    id: "a2",
    topic: 2,
    title: "Before you present under a letter of credit: ten frequent discrepancies",
    body: `An LC refusal is usually not a bank that “suddenly will not pay”. The documents do not match the credit. These ten items can be ticked before presentation. Ticking them describes the surface risk. It is not a promise of payment.

1. Does the invoice amount or currency exceed what the credit allows.
2. Does the goods description match the credit word for word, with no informal short name.
3. Is the shipment date on the bill of lading or transport document later than the latest shipment date.
4. Do the beneficiary and applicant names match the credit and every amendment exactly.
5. Do the originals, copies and the way they are signed follow the credit.
6. Are the certificate of origin, the inspection certificate and the packing list all required, and are the issuer and the date acceptable.
7. Is the insurance document dated no later than shipment, with the cover and the amount the credit asks for.
8. Are the presentation period and the expiry still open, and is the place of presentation correct.
9. Has every amendment been accepted. Following only one amendment leaves the rest of the original credit in force.
10. Is there a soft clause the beneficiary cannot satisfy alone, such as a buyer's inspection certificate when the buyer will not issue it.

Method: the credit on the left, the document on the right. Write the mismatch. Do not rely on memory. If a refusal has already happened, take each discrepancy in the bank's message and see whether it was the document or the presentation period.

A soft clause, and a refusal that has already happened, go on the risk list. Whether to change the settlement method, or to replace a document, is a question for the paid proposal.`,
  },
  {
    id: "a3",
    topic: 3,
    title: "An export-rebate file: what to check first when three documents must match",
    body: `This does not estimate how much can be refunded, or when it will arrive. The amount and the timing are whatever the tax authority accepts on the real documents. If there is a dispute, a licensed accountant reviews it. What follows is only the order of the file check.

First, are these three the same shipment: the customs declaration, the invoice, and the receipt record.

On the declaration: description, quantity, amount, currency, incoterm, export date, contract number.
On the invoice: whether the description, quantity and amount of the sales or export invoice can be walked back to the declaration, and whether the input invoice belongs to this shipment.
On the receipt: the amount, currency and date of the bank credit, and whether it belongs to this shipment rather than being mixed into another contract.

When they disagree, do not rewrite the filing story. Label the gap: quantity, amount, description, receipt not in, or a credit that was split. Each gap points at a piece of evidence to add. Write it as a missing paper, not as an “expected rebate”.

Also ask who files, why the last filing was sent back, and whether the originals live in WeChat, in email, or in an archive. If an old document takes more than half a day to find, that is itself a risk.

On cross-border tax, a permanent establishment, withholding and transfer pricing are questions only: has anyone listed them. If not, record a compliance risk. The free diagnosis does not conclude it.

The file, the checklist and the gap list are deliverables of the export finance pack. They are not attachments to this public draft.`,
  },
];

export const templateSeeds: { id: string; name: string; from: string; body: string }[] = [
  {
    id: "t1",
    name: "Overseas project model",
    from: "Source brief · one of the four preparation templates",
    body: `# Overseas project model
Masked project name:
Country:
Contract value (name the currency):
Status: draft / internal model only, not a quote and not a promise

## Revenue
| Milestone | Ratio | Amount | Expected month | Contract basis |
| --- | --- | --- | --- | --- |
| Advance |  |  |  |  |
| Progress |  |  |  |  |
| Acceptance |  |  |  |  |
| Retention |  |  |  |  |

## Cost (control what has happened; do not guess the rest)
| Item | Budget | Incurred | Remaining | Note |
| --- | --- | --- | --- | --- |
| Materials |  |  |  |  |
| Labor |  |  |  |  |
| Freight and clearance |  |  |  |  |
| Site overhead |  |  |  |  |
| Tax and bonds |  |  |  |  |

## Cash gap
Roll it monthly. Lead time on a gap (weeks):
Warning line (set by you; this is not an FX forecast):
No suggestion to advance funds. No bridge.
`,
  },
  {
    id: "t2",
    name: "Export document checklist",
    from: "Source brief · one of the four preparation templates",
    body: `# Export document checklist
Internal shipment no.:
Settlement: TT / LC / DP / OA
Contract no.:

| Document | Present | Matches the contract | Matches the declaration | Gap |
| --- | --- | --- | --- | --- |
| Contract |  |  |  |  |
| Invoice |  |  |  |  |
| Packing list |  |  |  |  |
| Bill of lading or waybill |  |  |  |  |
| Customs declaration |  |  |  |  |
| Origin / inspection |  |  |  |  |
| LC and amendments |  |  |  |  |
| Bank receipt |  |  |  |  |

Record discrepancies only. This sheet does not promise a receipt or a rebate.
`,
  },
  {
    id: "t3",
    name: "Collections tracker",
    from: "Source brief · one of the four preparation templates",
    body: `# Collections tracker
Masked client name:
Project or contract:

| No. | Milestone | Due | Received | Open | Due date | Status | Next |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  | Not due / due / condition not met |  |

Keep the statuses apart: due and unpaid, condition not met (retention, variation not confirmed), papers incomplete.
This sheet is not a promise to collect, and it is not a percentage of collections.
`,
  },
  {
    id: "t4",
    name: "Diagnosis report",
    from: "Source brief · one of the four preparation templates",
    body: `# Diagnosis risk list
Masked client name:
Date:
Length: 30 minutes
Rule: a risk list only, not a full proposal. No FX forecast. No promise on rebates, loans or collections.

| No. | Risk | Effect (collections / cost / compliance) | Suggested next step |
| --- | --- | --- | --- |
| 1 |  |  | The full method is in the paid proposal |

Close:
These 30 minutes only list the risks. The full method, the model and the execution list are in the paid proposal. Start with the export finance pack, or with one overseas project on retainer.

Next meeting:
`,
  },
  {
    id: "t5",
    name: "Monthly finance pack",
    from: "Supplement · template added for task 002",
    body: `# Monthly finance pack
Masked client name:
Month:
Product: export finance pack / overseas project retainer

## Facts this month (only documents that have been checked)
Receipts:
Progress settlement:
New variations:
Rebate file: complete / gap / not started

## Collections warning
| Project | Open | Of which due | Of which condition not met | Warning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Only three things next month
1.
2.
3.

No handling of funds. No forecast of a rebate amount.
`,
  },
  {
    id: "t6",
    name: "Contract points",
    from: "Supplement · not a legal text. A licensed lawyer drafts or reviews the contract.",
    body: `# Contract points (this is not a contract)
Before use: this list only helps the finance principal check the commercial points. A licensed lawyer drafts or reviews the actual contract.

## Boundary of the work
- Product: export finance pack / overseas retainer / settlement and collections
- Deliverables:
- Not included: no handling of funds, no advance, no equity, no bridge, no promise of a rebate amount, a loan size, or a collection result

## Price and payment
- The suggested starting price is an internal anchor. The number that goes outside is the quote the principal confirms
- Work starts after a 50% deposit. Monthly work is prepaid. The balance is cleared before delivery
- “Do it first, pay if it works” is not accepted

## Files and confidentiality
- The client provides the contract, the documents and the basic accounts
- Project files are stored apart
- A case is published only with separate written consent, and only masked

## Referral fee
- The rate and the settlement go in the cooperation agreement. A verbal promise does not count
`,
  },
  {
    id: "t7",
    name: "Review and case notes",
    from: "Supplement · do not publish without consent",
    body: `# Review and case notes
Masked client name:
Product:
Service from / to:

## All of these must be true before anything is public
- [ ] The client agreed in writing
- [ ] It is masked (no real documents, no full company name, no private contact)
- [ ] It does not promise a rebate amount or a collection result
- [ ] The finance principal has confirmed it can go outside

## Facts
The risks at the time:
The deliverables that were actually produced:
A sentence the client is willing to have quoted (leave blank if none):

If the boxes are not all ticked, it does not go in a public case section.
`,
  },
];

export const e2eSteps = [
  "List",
  "Client file",
  "Diagnosis: a risk list only",
  "Order and quote",
  "Collection plan",
  "Work starts when the deposit or this month's prepayment is in",
  "Deliverables checked and the balance cleared",
  "Review. A public case also needs the client's consent",
];
