# ClearPath Credit 🌾
### Explainable AI for Rural Credit Scoring

> **Team:** Bradley Opiyo & Joshua Kingsley  
> **Track:** Mercy Corps AgriFin Track — Kenya AI Challenge  
> **Route:** Route 1 · eSusFarm Brief (Finance Challenge Category)  
> **Stack:** `Featherless (Qwen-2.5)` · `Neo4j` · `XGBoost` · `Masumi Agents` · `Lovable`

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Literature Review](#2-literature-review)
3. [Proposed Solution](#3-proposed-solution)
4. [Scoring Model](#4-scoring-model)
5. [System Architecture](#5-system-architecture)
6. [References](#6-references)

---

## 1. Problem Statement

**Selected Brief:** *"Explainable AI for Credit Scoring (Women Farmers + USSD)"* — submitted by eSusFarm, Uganda.

In Uganda, women smallholder farmers constitute the majority of the agricultural workforce yet remain structurally excluded from formal credit by traditional collateral requirements. While alternative digital credit models offer a path forward, standard AI explainability tools are designed for visual dashboards — too complex for the **182-character USSD/SMS interfaces** in local languages that these farmers rely on.

This leaves lenders facing a stark trade-off:

| Concern | Description |
|---|---|
| **Predictive accuracy** | Opaque models score thin-file borrowers more reliably |
| **Transparency** | Explainability tools require bandwidth and literacy beyond USSD |
| **Consumer protection** | Bank of Uganda regulations demand auditable decisions |
| **Farmer agency** | Unexplained rejections cannot be acted upon |

**Persona — Joyce Namuli:** A creditworthy but thin-file coffee farmer in Masaka District who accesses financial services via a basic feature phone. When she receives an unexplained tier rating or rejection, she cannot identify which behaviors to adjust. Relying on third parties to read SMS output compromises her privacy and financial agency.

---

## 2. Literature Review

| Statistic | Source |
|---|---|
| Women contribute **~73%** of Uganda's agricultural labour force | World Bank, 2021 [1] |
| Fewer than **1 in 10** adults borrow for agricultural purposes | FSD Uganda FinScope, 2018 [2] |
| Gender mobile-ownership gap: **~4%** urban, **~22%** rural | GSMA Mobile Gender Gap, 2021 [3] |

eSusFarm already operates a USSD-based agricultural finance model for smallholder farmers in Uganda, confirming this is a **live delivery channel**, not a hypothetical one. A USSD simulator artifact was provided directly with the brief.

The five behavioral predictors used in our scoring model are drawn from a 2022 observational study of smallholder credit access in the Jinja region of Uganda (~374 farmer records, reported credit-access rate of **62.83%**) [4].

> **Methodological note:** This study is regional, observational, and several years old. It establishes plausible predictor relevance — not causal certainty. Our synthetic dataset is calibrated against it as a methodological anchor, not a production-grade ground truth.

---

## 3. Proposed Solution

We build a **USSD/SMS explanation layer** that sits on top of an existing credit tier decision and answers three questions for the farmer:

```
1. What was decided?
2. What most affected the decision?
3. What one realistic action could improve my position next season?
```

The core workflow:

```
Farmer requests "why" via USSD
         │
         ▼
System retrieves farmer record
         │
         ▼
Neo4j finds relationally similar peers who improved their tier
         │
         ▼
RAG pipeline (Featherless / Qwen-2.5) generates localised explanation
         │
         ▼
Message delivered within USSD/SMS character limits, in farmer's language
```

The system **never** instructs the farmer to change something outside her control (e.g. land ownership, collateral holdings).

---

## 4. Scoring Model

### 4.1 Hybrid Credit Index

The credit score is defined as a convex combination of a behavioural score and a graph-based trust score:

$$S_{\text{total}} = \alpha \cdot M(\mathbf{x}) + (1 - \alpha) \cdot G(\mathbf{v})$$

| Symbol | Description |
|---|---|
| $M(\mathbf{x})$ | Behavioural score from gradient-boosted model (XGBoost) |
| $G(\mathbf{v})$ | Normalised trust score from Neo4j relationship graph |
| $\alpha \in [0,1]$ | Weighting parameter balancing individual vs. network trust |

### 4.2 Behavioural Predictors — $M(\mathbf{x})$

The feature vector $\mathbf{x} \in \mathbb{R}^5$ consists of the following documented predictors:

$$\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \end{bmatrix} = \begin{bmatrix} \text{Repayment timing} \\ \text{Input-purchase consistency} \\ \text{Mobile/USSD usage consistency} \\ \text{Savings-group participation} \\ \text{Farm size / market distance} \end{bmatrix}$$

### 4.3 Graph Trust Score — $G(\mathbf{v})$

The graph trust score $G(\mathbf{v})$ is derived from the farmer's node position within the Neo4j relationship graph:

$$G(\mathbf{v}) = \frac{f(\mathbf{v}) - \min_{\mathbf{v}} f}{\max_{\mathbf{v}} f - \min_{\mathbf{v}} f}$$

where $f(\mathbf{v})$ is a relational centrality function encoding shared savings groups, input dealers, and cooperative memberships.

> **Design rationale:** A graph is preferred over a vector-similarity lookup because peer-matching requires **shared relationships**, not just feature-space distance.

### 4.4 Explainability Constraint

We deliberately avoid forcing a fully transparent white-box model, because doing so would recreate the brief's stated trade-off — sacrificing predictive power and excluding the thin-file farmers most in need. Instead:

- Full feature-importance attribution $\phi_i(\mathbf{x})$ (SHAP values) routes to the **lender MIS dashboard**
- Only behaviours within the farmer's control — $\{x_1, x_2, x_3\}$ — are isolated and passed to the communication layer

$$\phi_{\text{farmer}} = \{\phi_i(\mathbf{x}) : x_i \in \mathbf{x}_{\text{controllable}}\}$$

---

## 5. System Architecture

### 5.1 Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Masumi Agent Bus                        │
│         (coordinates Data Collection → Score → Explain)      │
└──────────┬─────────────────┬──────────────────┬─────────────┘
           │                 │                  │
     ┌─────▼──────┐   ┌──────▼──────┐   ┌──────▼──────────┐
     │  XGBoost   │   │    Neo4j    │   │  Featherless     │
     │  M(x)      │   │   G(v) +   │   │  (Qwen-2.5)     │
     │            │   │  Peer Graph │   │  RAG + Language  │
     └─────┬──────┘   └──────┬──────┘   └──────┬──────────┘
           │                 │                  │
           └────────┬────────┘                  │
                    │                           │
             ┌──────▼───────┐           ┌───────▼──────────┐
             │  S_total     │           │  USSD / SMS      │
             │  + SHAP φᵢ   ├──────────►│  (≤182 chars,    │
             └──────┬───────┘           │   local language)│
                    │                   └──────────────────┘
                    ▼
           ┌────────────────┐
           │  Lender MIS    │
           │  Dashboard     │
           │  (Lovable UI)  │
           └────────────────┘
```

### 5.2 Layer Responsibilities

| Layer | Component | Responsibility |
|---|---|---|
| **Decision** | XGBoost + Neo4j | Compute $S_{\text{total}}$; generate SHAP attributions |
| **Institutional** | Lender MIS (Lovable) | Full $\phi_i(\mathbf{x})$ for bias auditing and regulatory compliance |
| **Communication** | Featherless / Qwen-2.5 | Compress explanation into localised USSD/SMS message |
| **Graph** | Neo4j | Peer-comparison matching via shared relational edges |
| **Coordination** | Masumi Agents | Agent-to-agent job orchestration across all layers |

---

## 6. References

[1] World Bank. (2021). *A sustainable green recovery for Uganda depends on women.* World Bank Blogs. https://blogs.worldbank.org/en/nasikiliza/sustainable-green-recovery-uganda-depends-women

[2] FSD Uganda. (2018). *FinScope Uganda 2018 Survey Report.* Financial Sector Deepening Uganda. https://fsduganda.or.ug

[3] GSMA. (2021). *The Mobile Gender Gap Report 2021.* GSM Association. https://www.gsma.com/gender-gap-2021/

[4] Midamba, D., Obrine, A., Kwesiga, M., Beatrice, A. and Kizito, O. (2022). 'Drivers of Access to Credit Among Smallholder Farmers in Uganda: Application of Binary Logistic Model.' *East African Journal of Business and Economics*, 5(1), pp. 154–163. https://doi.org/10.37284/eajbe.5.1.62

---

<div align="center">

*ClearPath Credit — Kenya AI Challenge 2025*  
*Mercy Corps AgriFin Track · Route 1*

</div>
