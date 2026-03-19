from flask import Blueprint, request, jsonify
import sqlite3
import datetime

assessment_bp = Blueprint('assessment', __name__)

def get_db():
    conn = sqlite3.connect('db.sqlite3')
    conn.row_factory = sqlite3.Row
    return conn

def classify(score):
    if score <= 5:
        return "Low"
    elif score <= 10:
        return "Medium"
    else:
        return "High"

@assessment_bp.route('/submit-assessment', methods=['POST'])
def submit_assessment():
    data = request.get_json()
    user_id = data['user_id']
    company_id = data['company_id']
    answers = data['answers']

    #  Industry-specific likelihood values
    INDUSTRY_LIKELIHOODS = {
        "Healthcare": [5, 5, 5, 4, 3, 4, 5, 5, 5, 4, 4, 4, 3, 3, 3, 4, 3, 3, 3, 4,
                       4, 4, 3, 3, 4, 3, 4, 4, 4, 3, 3, 3, 4, 3, 3, 3, 3, 3, 4, 3,
                       4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 5, 5, 4, 4],
        "Finance": [4, 4, 5, 4, 4, 3, 4, 5, 4, 4, 4, 4, 4, 3, 4, 4, 3, 3, 4, 4,
                    5, 5, 3, 4, 4, 3, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
                    3, 4, 4, 5, 5, 4, 4, 4, 4, 4, 5, 5, 4, 4, 5, 4, 4, 5, 4, 4],
        "Education": [3, 4, 4, 3, 3, 2, 3, 4, 3, 2, 3, 3, 2, 3, 3, 3, 2, 2, 3, 3,
                      3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
                      3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3],
        "Hospitality": [4, 5, 4, 4, 3, 3, 4, 4, 4, 3, 4, 3, 2, 3, 2, 3, 2, 3, 2, 3,
                        4, 4, 3, 4, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2, 3, 2,
                        3, 4, 4, 4, 4, 3, 4, 4, 3, 3, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4],
        "Energy": [5, 5, 5, 4, 4, 4, 5, 5, 5, 4, 4, 4, 3, 4, 4, 4, 3, 3, 4, 4,
                   4, 4, 4, 4, 4, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 2, 3, 3, 4, 3,
                   4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 5, 5, 5, 5, 5, 4, 5, 5, 4, 4],
        "Industrial": [4, 4, 4, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3,
                       3, 3, 3, 3, 3, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
                       3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 4, 4, 4, 3, 3, 3, 3, 4, 3, 3],
        "Technology": [5, 5, 5, 4, 4, 4, 5, 5, 5, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4,
                       4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 4, 3,
                       4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        "Default": [3] * 60
    }

    #  Fetch company industry
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT industry FROM companies WHERE id = ?", (company_id,))
    row = cur.fetchone()
    industry = row['industry'] if row else "Default"
    conn.close()

    likelihood_map = INDUSTRY_LIKELIHOODS.get(industry, INDUSTRY_LIKELIHOODS["Default"])

    # Calculate scores
    total_score = 0
    detailed_results = []

    for index, answer in enumerate(answers):
        impact = int(answer['impact'])
        likelihood = likelihood_map[index] if index < len(likelihood_map) else 3
        score = impact * likelihood
        level = classify(score)

        total_score += score
        detailed_results.append({
            "question": index + 1,
            "impact": impact,
            "likelihood": likelihood,
            "score": score,
            "level": level
        })

    average_score = total_score / len(answers)
    overall_level = classify(average_score)
    timestamp = datetime.datetime.now().isoformat()

    #  Save to DB (both assessments + details)
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO assessments (user_id, company_id, risk_score, created_at)
        VALUES (?, ?, ?, ?)
    """, (user_id, company_id, average_score, timestamp))
    assessment_id = cur.lastrowid

    for result in detailed_results:
        cur.execute("""
            INSERT INTO assessment_details (assessment_id, question, impact, likelihood, score, level)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            assessment_id,
            result["question"],
            result["impact"],
            result["likelihood"],
            result["score"],
            result["level"]
        ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Assessment submitted",
        "risk_score": average_score,
        "risk_level": overall_level,
        "details": detailed_results,
        "created_at": timestamp
    })


@assessment_bp.route('/assessments/<int:company_id>', methods=['GET'])
def get_assessments(company_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM assessments WHERE company_id = ?", (company_id,))
    rows = cur.fetchall()
    assessments = [dict(row) for row in rows]
    conn.close()
    return jsonify(assessments)


@assessment_bp.route('/assessment/<int:assessment_id>', methods=['GET'])
def get_single_assessment(assessment_id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM assessments WHERE id = ?", (assessment_id,))
    assessment_row = cur.fetchone()
    if not assessment_row:
        return jsonify({'error': 'Assessment not found'}), 404

    assessment = dict(assessment_row)

    cur.execute("SELECT * FROM assessment_details WHERE assessment_id = ?", (assessment_id,))
    details = [dict(row) for row in cur.fetchall()]

    assessment['details'] = details
    conn.close()
    return jsonify(assessment)
