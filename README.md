# ClearPath Credit 🌾 | Explainable AI for Rural Credit Scoring

**Team Name:** ClearPath Credit (Bradley Opiyo, Joshua Kingsley)  
**Track:** Mercy Corps AgriFin Track — Kenya AI Challenge (Route 1: eSusFarm Brief)  
**Core Stack:** `Featherless (Qwen-2.5)` | `Neo4j` | `XGBoost` | `Masumi Agents` | `Lovable`

Phase One: Problem Understanding & Solution Game Plan
Mercy Corps AgriFin Track — Kenya AI Challenge
Team Name: ClearPath Credit (Bradley Opiyo, Joshua Kingsley)
Problem Route: Our team is using Route 1: an official Kenya AI Challenge AgriFin brief, selected 
from the Finance Challenge category.
Selected Brief: "Explainable AI for Credit Scoring (Women Farmers + USSD)" — submitted by eSusFarm, Uganda. The brief addresses why women smallholder farmers accessing credit through USSD and 
feature phones often receive a credit decision they cannot understand or act on, and why standard AI explainability tools are not designed for low-bandwidth, local-language delivery.

1. Problem Understanding
In Uganda, women smallholder farmers make up the majority of the agricultural workforce but are structurally excluded from formal credit by traditional collateral requirements. While alternative digital credit 
models offer a solution, standard AI explainability tools are designed for visual dashboards—making 
them too complex to fit into the low-bandwidth, 182-character USSD or SMS interfaces in local languages that these farmers rely on. As a result, lenders face a stark trade-off between predictive accuracy 
and transparency, leaving thin-file borrowers with unexplained automated decisions. Resolving this requires translating sophisticated scoring algorithms into concise, trustworthy, and localized feedback that 
empowers farmers while helping financial institutions meet consumer protection standards.

This communication barrier directly impacts rural borrowers like Joyce Namuli, a creditworthy but thin-file coffee farmer in Masaka District who accesses credit via a basic feature phone. When she receives 
an unexplained tier rating or loan rejection, she cannot identify which behaviors to adjust, and relying on 
third parties to read the text compromises her privacy and financial agency. Concurrently, secondary users like lenders and farmer-facing organizations (such as eSusFarm) lack a compliant, scalable mechanism to deliver these vital insights without exposing proprietary scoring logic or creating legal risk under Bank of Uganda regulations. By bridging this gap, the solution protects borrower privacy, establishes transparent next steps for the farmer, and satisfies institutional auditing requirements.

2. Literature Review
Women contribute an estimated 73% of Uganda's agricultural labor force [1], yet fewer than 1 in 10 
adults borrow for agricultural purposes [2] — a gap that lending models built around collateral and land 
title widen further for women specifically.

The digital channel meant to reach her is itself unevenly distributed: Uganda's gender gap in mobile 
phone ownership is roughly 4% in urban areas but rises to about 22% in rural areas [3], meaning the 
USSD/feature-phone channel this brief targets is precisely where access is most unequal.

eSusFarm already operates a USSD-based agricultural finance model for smallholder farmers in Uganda, 
confirming this is a live delivery channel, not a hypothetical one. A USSD simulator artifact was provided directly with the brief, giving our team a real interaction surface to design and test against.
Mercy Corps AgriFin Track — Phase One Submission
Page 2

The five behavioral predictors used in our scoring model — repayment timing, input-purchase consistency, mobile/USSD usage consistency, savings-group participation, and farm size/market distance —
are drawn from a 2022 observational study of smallholder credit access in the Jinja region of Uganda 
(approximately 374 farmer records, with a reported credit-access rate of 62.83%) [4]. It should be noted 
explicitly that this study is regional, observational, and now several years old; it establishes plausible 
predictor relevance, not causal certainty, and our synthetic dataset is calibrated against it as a methodological anchor, not a production-grade ground truth.

3. Proposed Solution
We are building a USSD/SMS-based explanation layer that sits on top of an existing credit tier decision 
and gives the farmer a short, plain-language answer to three questions: what was decided, what most affected the decision, and what one realistic action could improve her position next season.

The core workflow: a farmer receives her tier through USSD and can request "why." The system retrieves her record, finds other farmers with genuinely similar behavior profiles who improved their tier 
over time, and uses that grounded comparison — rather than a generic tip — to generate her explanation. 
The message is delivered in her language, within USSD/SMS length constraints, and never asks her to 
change something outside her control, such as land ownership or collateral.

This is useful because it turns a black-box yes/no outcome into something a farmer can act on, while 
giving lenders an explanation layer that supports fairness and consumer-protection expectations without 
exposing proprietary scoring logic.

Proposed Decision engine (foundational layer) - Sitting on top of the variables of the Jinja Study in G(v)
The credit index is a hybrid model defined as:

S_total = α · M(x) + (1 - α) · G(v)

Where:
* M(x) is a behavioral score derived from a gradient-boosted model (XGBoost) trained on five 
documented predictors: repayment timing, input-purchase consistency, mobile/USSD usage 
consistency, savings-group participation, and farm size/market distance.
* G(v) is a normalized trust score derived from the farmer's position in the Neo4j relationship graph.
* α is a weighting parameter that balances individual behavioral scoring against network-based trust.

We do not force a fully transparent model, because doing so would recreate the brief's own stated trade-off — sacrificing predictive power and excluding the thin-file farmers most in need of credit. Instead, 
feature-importance attribution is generated alongside the score and resolved at the communication layer 
below, not suppressed.

Institutional masking and language layer (Featherless)
The full feature-importance output is routed to the lender's MIS dashboard, supporting bias auditing and 
institutional oversight — directly matching the brief's own guidance that this level of detail is for the 
organization, not the farmer. For the farmer, only behaviors within her control (wallet consistency, repayment timing) are isolated and passed through a Featherless-hosted RAG pipeline (e.g. Qwen-2.5) that 
compresses the explanation into a short, local-language message fitting USSD/SMS limits.
Mercy Corps AgriFin Track — Phase One Submission
Page 3

Graph layer (Neo4j)
Beyond feeding G(v), the same graph powers peer-comparison explanations — surfacing real, relationally similar farmers (shared savings group, input dealer, or cooperative) who improved their tier, so 
RAG-generated advice is grounded in real patterns, not generic tips. A graph is used here rather than a 
vector-similarity lookup because peer-matching needs shared relationships, not just feature distance.

Coordination and interface (Masumi)
Data Collection, Scoring, and Translation are coordinated as agent-to-agent job requests via Masumi. A 
Lovable demo shows the lender-facing MIS/feature-importance view and simulates the farmer-facing 
USSD experience.

7. References
[1] World Bank. (2021). A sustainable green recovery for Uganda depends on women. World Bank 
Blogs. Available at: https://blogs.worldbank.org/en/nasikiliza/sustainable-green-recovery-uganda-depends-women [Accessed June 2025].
[2] FSD Uganda. (2018). FinScope Uganda 2018 Survey Report. Financial Sector Deepening Uganda. 
Available at: https://fsduganda.or.ug [Accessed June 2025].
[3] GSMA. (2021). The Mobile Gender Gap Report 2021. GSM Association. Available at: 
https://www.gsma.com/gender-gap-2021/ [Accessed June 2025].
[4] Midamba, D., Obrine, A., Kwesiga, M., Beatrice, A. and Kizito, O. (2022). 'Drivers of Access to 
Credit Among Smallholder Farmers in Uganda: Application of Binary Logistic Model.' East African 
Journal of Business and Economics, 5(1), pp. 154–163. https://doi.org/10.37284/eajbe.5.1.62
