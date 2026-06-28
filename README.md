# AgriFin USSD Explainability Simulator

Welcome. This is the starter simulator for the eSusFarm challenge in the Mercy Corps AgriFin AI for Agriculture Innovation Challenge.

Your task is to build an explainability layer for farmer-facing credit decisions. The farmer should receive a short, practical explanation over SMS or USSD, in a language she can understand, with actions she can realistically take.

## What You Are Given

This simulator includes sanitized demo data only:

- `sample_data/hackathon_personas_flat.csv`
  Synthetic farmer personas with opaque feature columns such as `f_001`, `f_002`, and `f_003`.
- `sample_data/hackathon_shap_values.csv`
  Synthetic SHAP-style feature contribution rows for each persona.
- `sample_data/hackathon_action_map.json`
  A public demo map from opaque feature IDs to farmer-facing actions, translations, and gender-accessibility metadata.

The feature IDs are intentionally opaque. Treat them as model inputs. Do not try to reverse-engineer eSusFarm's production scoring system from them.

## What You Should Build

Build or improve a reusable explainability layer that can produce three outputs.

1. 160-character SMS explanation

Given a persona, decision tier, SHAP rows, language, and action map, return one short explanation a farmer can understand.

Example shape:

```text
Your tier is Bronze. Next step: book a soil test with your agent this week.
```

2. USSD counterfactual menu

Generate a menu of the top actions the farmer can take next. The menu must fit USSD constraints and remain clear after translation.

Example shape:

```text
eSusFarm Bronze | Not eligible
1. Book soil test
2. Record harvest
3. Request agent visit
4. Contest
0. Exit
```

3. Gender-equity diagnostic

Report whether women farmers are being recommended actions they may have less control over. Use the `controlled_by` and `gender_accessible` fields in the action map. If the top action is not accessible, rebalance toward a more actionable recommendation.

## Run The Simulator

From this folder:

```powershell
node server.js
```

Then open:

```text
http://127.0.0.1:8088
```

The simulator has no dependencies. It uses Node's built-in HTTP server.

## Suggested Code Structure

You may edit this simulator directly, or build your own library/app using the same input files.

A strong solution usually separates logic from UI:

```text
rank_actions(shap_rows, action_map, persona)
generate_sms(persona, ranked_actions, language)
generate_ussd_menu(persona, ranked_actions, language)
audit_gender_equity(personas, recommendations)
```

You can implement in JavaScript, Python, or another stack, as long as the input and output behavior is clear.

## Channel Constraints

- SMS explanation: target 160 characters or fewer.
- USSD screen: target 182 characters or fewer.
- Keep menus short and numbered.
- Avoid technical model terms in farmer-facing text.
- Use plain behavior language, not feature names.
- Do not assume the SMS/USSD message is private. It may be read aloud by a family member or field agent.

## What Good Looks Like

Your prototype should:

- Correctly use the top SHAP drivers.
- Produce short SMS and USSD outputs.
- Recommend practical farmer actions.
- Avoid recommending actions outside the farmer's control when safer alternatives exist.
- Support at least three African languages.
- Be reusable with any tabular scoring model and user-supplied action map.

## What Not To Do

Do not:

- Hardcode only the sample personas.
- Depend on eSusFarm backend services.
- Add production source files or internal documents.
- Expose production field names, formulas, internal score values, or private model mappings.
- Tell farmers about opaque feature IDs such as `f_001`.

## Included Files

```text
index.html
styles.css
simulator.js
server.js
sample_data/hackathon_personas_flat.csv
sample_data/hackathon_shap_values.csv
sample_data/hackathon_action_map.json
```

## Final Submission Guidance

Please include:

- Source code
- A short README
- Example SMS outputs
- Example USSD screens
- Gender-equity diagnostic output
- Notes on assumptions and limitations

The best submissions will be simple, explainable, farmer-safe, and reusable beyond eSusFarm.
