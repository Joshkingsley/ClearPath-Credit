This is a high-caliber, academic-style README.md designed for a technical
presentation or a high-level institutional review (e.g., Mercy Corps, AgriFin,
or World Bank).

It uses LaTeX formatting for mathematical rigor and Mermaid.js for architectural
visualization.

ClearPath Credit: A Hybrid Explainable AI (XAI) Framework for Smallholder Credit Scrutiny via Low-Bandwidth Channels

Project Track: Mercy Corps AgriFin Track — Kenya AI Challenge
Research Pathway: Financial Inclusion (Finance Challenge Category)
Target Region: Uganda (Smallholder Women Farmers)

1. Abstract

ClearPath Credit addresses the systemic exclusion of women smallholder farmers
from formal financial ecosystems. In sub-Saharan Africa, women contribute
approximately 73% of agricultural labor but are frequently marginalized by
"black-box" credit scoring models. Our framework introduces a hybrid scoring
engine—S_{total}—which synthesizes Gradient Boosted behavioral data with
Graph-based social capital. Crucially, the system utilizes a Large Language
Model (LLM) orchestration layer to decompose high-dimensional SHAP (SHapley
Additive exPlanations) values into actionable, localized USSD/SMS feedback,
ensuring institutional transparency and borrower agency in low-connectivity
environments.

2. System Architecture & Methodology

2.1 The Hybrid Scoring Objective Function

To mitigate the "thin-file" problem common among rural borrowers, we move beyond
univariate behavioral models. We define creditworthiness through a composite
index:

S_{total} = \alpha \cdot M(x) + (1 - \alpha) \cdot G(v)

Where:

  - M(x): Behavioral score derived from an XGBoost regressor, trained on
    predictors identified in the 2022 Jinja Study (repayment latency, USSD
    engagement, and input consistency).
  - G(v): Social Trust Score derived from Neo4j Graph Data Science, mapping the
    farmer’s centrality within savings groups (SACCOs) and input-dealer
    networks.
  - \alpha: The balancing coefficient (hyper-parameterized at 0.65) to ensure
    individual accountability is weighted against community-based trust.

2.2 Explainability Pipeline (XAI)

To provide transparency without exposing proprietary logic, we calculate the
Shapley values (\phi_i) for the model's output:

f(x) = L + \sum_{i=1}^{M} \phi_i(f, x)

The system filters these values to identify Controllable Behavioral Drivers.
These drivers are then passed through the Featherless-Qwen RAG pipeline to
generate a 160-character natural language explanation in local dialects (e.g.,
Luganda).

3. Operational Optimization

A core innovation of ClearPath Credit is the integration of Optimization
Algorithms to facilitate physical interventions where digital nudges are
insufficient.

3.1 Geospatial Agent Allocation (ARO)

For farmers whose scores are suppressed by factors requiring physical
verification (e.g., Soil Health f_{032}), the system triggers an Agent Routing
Optimization. This is modeled as a Capacitated Vehicle Routing Problem (CVRP):

\text{Minimize } Z = \sum_{i \in V} \sum_{j \in V} c_{ij} x_{ij}

Subject to:

  - Maximizing the "Expected Credit Lift" per agent-visit.
  - Minimizing fuel and transit time across rural coordinates.

3.2 Dynamic Resource Migration

By monitoring the Graph Centrality in Neo4j, the algorithm identifies "Trust
Sinks"—localized regions where group repayment is fluctuating. The system
optimizes the movement of mobile advisory units to these high-risk nodes to
prevent "credit contagion," ensuring the stability of the lender's portfolio.

4. Technical Stack

graph TD
    A[Farmer USSD Input] --> B{Masumi Agent}
    B --> C[XGBoost Engine]
    B --> D[Neo4j Graph DB]
    C --> E[SHAP Explainer]
    D --> F[G(v) Trust Score]
    E & F --> G[Hybrid Index]
    G --> H[Featherless LLM]
    H --> I[Localized SMS/USSD]
    I --> J[Optimization: Agent Dispatch]

  - Logic Core (server.js): Orchestrates the Masumi agentic workflow.
  - Interaction Engine (simulator.js): State-machine for USSD navigation.
  - Graph Layer: Neo4j AuraDB for social capital mapping.
  - Inference: Featherless.ai (Qwen-2.5-72B) for high-compression XAI
    translation.

5. Deployment & Structure

| File           | Category      | Function                                                    |
| :------------- | :------------ | :---------------------------------------------------------- |
| `server.js`    | **Back-end**  | Masumi agent coordination & ML inference.                   |
| `simulator.js` | **UX/UI**     | Simulated USSD environment for field testing.               |
| `index.html`   | **Dashboard** | Lender-facing bias audit and optimization map.              |
| `sample_data/` | **Data**      | Calibrated synthetic records based on the Jinja 2022 study. |

6. Performance & Reward Function

The success of the ClearPath model is evaluated against an integrated Reward
Function R:

R = (Accuracy \cdot \beta) + (Equity\_Weight \cdot \gamma) - (Complexity\_Penalty)

This ensures the model remains mathematically accurate while penalizing any bias
against female borrowers or over-complicated USSD outputs.

7. Institutional Compliance

ClearPath Credit aligns with Bank of Uganda Consumer Protection Guidelines and
GDPR-standard data masking, ensuring that while the farmer receives an
actionable nudge, her raw scoring data remains encrypted and institutionalized.

ClearPath Credit | Explainability for Empowerment
© 2025 Kenya AI Challenge / Mercy Corps AgriFin. All rights reserved.
