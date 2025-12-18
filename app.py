from flask import Flask, render_template, request, jsonify, send_file, session
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps
import datetime
import pandas as pd
import requests

app = Flask(__name__)
app.secret_key = "your-secret-key-here"
CORS(app, supports_credentials=True)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['job_portal']

# Collections
employees = db.employees
companies = db.companies
jobs = db.jobs
applications = db.applications
posts = db.posts
invitations = db.invitations

data = pd.read_csv('engineering colleges in India.csv')
COLLEGES = data['College Name'].dropna().tolist()
SCHOOLS = [
    "Delhi Public School, R.K. Puram",
    "Delhi Public School, Mathura Road",
    "Kendriya Vidyalaya, RK Puram",
    "Kendriya Vidyalaya, Noida",
    "DAV Public School, Mathura Road",
    "DAV Public School, RK Puram",
    "Ryan International School, Mumbai",
    "Ryan International School, Pune",
    "St. Xavier's High School, Mumbai",
    "St. Xavier's Collegiate School, Kolkata",
    "National Public School, Bangalore",
    "National Public School, Indiranagar",
    "Modern School, Barakhamba Road",
    "Modern School, Vasant Vihar",
    "The Doon School, Dehradun",
    "La Martiniere College, Kolkata",
    "La Martiniere College, Lucknow",
    "Bishop Cotton School, Shimla",
    "Bishop Cotton Boys' School, Bangalore",
    "Sishya School, Chennai",
    "Loreto House, Kolkata",
    "St. Paul's School, Darjeeling",
    "Campion School, Mumbai",
    "St. Joseph's Boys' High School, Bangalore",
    "St. Joseph's Convent, Allahabad",
    "Mayo College, Ajmer",
    "Mayo College Girls' School, Ajmer",
    "Welham Boys' School, Dehradun",
    "Welham Girls' School, Dehradun",
    "Laurel High International School, Pune",
    "Bishop Westcott Boys' School, Ranchi",
    "Bishop Westcott Girls' School, Ranchi",
    "Fr. Agnel School, Mumbai",
    "Vasant Valley School, Delhi",
    "Rishi Valley School, Andhra Pradesh",
    "Scindia School, Gwalior",
    "St. George's College, Mussoorie",
    "Mount St. Mary's School, Delhi",
    "St. Thomas' School, Delhi",
    "Sanskriti School, Delhi",
    "Jamia Millia Islamia Senior Secondary School, Delhi",
    "Air Force Bal Bharati School, Delhi",
    "Army Public School, Delhi Cantt",
    "Sardar Patel Vidyalaya, Delhi",
    "Springdales School, Dhaula Kuan",
    "Springdales School, Pusa Road",
    "City Montessori School, Lucknow",
    "St. Mary's School, Pune",
    "St. Arnold's School, Pune",
    "Convent of Jesus and Mary, Delhi",
    "Convent of Jesus and Mary, Shimla",
    "Modern English School, Pune",
    "St. Michael's School, Patna"
]



def convert_objectid(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    else:
        return obj

def serialize_doc(doc):
    return convert_objectid(doc)

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]



# Authentication Routes
@app.route('/api/signup/employee', methods=['POST'])
def signup_employee():
    data = request.get_json()
    
    if employees.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400
    
    employee = {
        'email': data['email'],
        'name': data['name'],
        'password': data['password'],
        'course': data['course'],
        'skills': data['skills'],
        'college_info': data['college_info'],
        'school_info': data['school_info'],
        'cgpa': float(data['cgpa']),
        'hsc_percent': float(data['hsc_percent']),
        'ssc_percent': float(data['ssc_percent']),
        'experience': data.get('experience', ''),
        'profile_photo': data.get('profile_photo', ''),
        'gender': data['gender'],
        'created_at': datetime.datetime.utcnow()
    }
    
    result = employees.insert_one(employee)
    return jsonify({'message': 'Employee registered successfully', 'id': str(result.inserted_id)}), 201

@app.route('/api/signup/company', methods=['POST'])
def signup_company():
    data = request.get_json()
    
    if companies.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400
    
    company = {
        'company_name': data['company_name'],
        'email': data['email'],
        'password': data['password'],
        'industry': data['industry'],
        'description': data['description'],
        'year_founded': data.get('year_founded', ''),
        'company_type': data.get('company_type', ''),
        'company_size': data['company_size'],
        'headquarters': data['headquarters'],
        'contact_person': data['contact_person'],
        'social_links': data.get('social_links', {}),
        'company_logo': data.get('company_logo', ''),
        'created_at': datetime.datetime.utcnow()
    }
    
    result = companies.insert_one(company)
    return jsonify({'message': 'Company registered successfully', 'id': str(result.inserted_id)}), 201

@app.route('/api/login/employee', methods=['POST'])
def login_employee():
    data = request.get_json()
    employee = employees.find_one({'email': data['email']})
    
    if employee and employee['password'] == data['password']:
        session['user_id'] = str(employee['_id'])
        session['user_type'] = 'employee'
        session['user_name'] = employee['name']
        return jsonify({'message': 'Login successful', 'user_type': 'employee'}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/login/company', methods=['POST'])
def login_company():
    data = request.get_json()
    company = companies.find_one({'email': data['email']})
    
    if company and company['password'] == data['password']:
        session['user_id'] = str(company['_id'])
        session['user_type'] = 'company'
        session['user_name'] = company['company_name']
        return jsonify({'message': 'Login successful', 'user_type': 'company'}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({
            'logged_in': True,
            'user_type': session['user_type'],
            'user_name': session['user_name'],
            'user_id': session['user_id']
        }), 200
    return jsonify({'logged_in': False}), 200

# Data Routes
@app.route('/api/colleges', methods=['GET'])
def get_colleges():
    return jsonify(COLLEGES), 200

@app.route('/api/schools', methods=['GET'])
def get_schools():
    return jsonify(SCHOOLS), 200

# Employee Routes
@app.route('/api/employee/profile', methods=['GET', 'PUT'])
def employee_profile():
    if session.get('user_type') != 'employee':
        return jsonify({'error': 'Unauthorized'}), 401
    
    if request.method == 'GET':
        employee = employees.find_one({'_id': ObjectId(session['user_id'])})
        if employee:
            employee.pop('password')
            return jsonify(serialize_doc(employee)), 200
        return jsonify({'error': 'Employee not found'}), 404
    
    elif request.method == 'PUT':
        data = request.get_json()
        data.pop('_id', None)  # Remove _id if present
        data.pop('password', None)  # Don't update password here
        
        employees.update_one(
            {'_id': ObjectId(session['user_id'])},
            {'$set': data}
        )
        return jsonify({'message': 'Profile updated successfully'}), 200

@app.route('/api/posts', methods=['GET', 'POST'])
def handle_posts():
    if request.method == 'GET':
        all_posts = list(posts.find().sort('created_at', -1))
        for post in all_posts:
            post['_id'] = str(post['_id'])
            post['author_id'] = str(post['author_id'])
        return jsonify(all_posts), 200
    
    elif request.method == 'POST':
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json()
        post = {
            'author_id': ObjectId(session['user_id']),
            'author_name': session['user_name'],
            'author_type': session['user_type'],
            'content_type': data['content_type'],  # 'text', 'image', 'video'
            'content': data['content'],
            'caption': data.get('caption', ''),
            'created_at': datetime.datetime.utcnow()
        }
        
        result = posts.insert_one(post)
        return jsonify({'message': 'Post created', 'id': str(result.inserted_id)}), 201
from bson import ObjectId


@app.route('/api/jobs', methods=['GET', 'POST'])
def handle_jobs():
    if request.method == 'GET':
        search_query = request.args.get('search', '')
        skills_filter = request.args.get('skills', '')
        
        query = {}
        if search_query:
            query['$or'] = [
                {'company_name': {'$regex': search_query, '$options': 'i'}},
                {'title': {'$regex': search_query, '$options': 'i'}}
            ]
        
        if skills_filter:
            skills_list = [skill.strip() for skill in skills_filter.split(',')]
            query['required_skills'] = {'$in': skills_list}
        
        job_list = list(jobs.find(query).sort('posted_at', -1))
        return jsonify(serialize_docs(job_list)), 200
    
    elif request.method == 'POST':
        if session.get('user_type') != 'company':
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json()
        job = {
            'company_id': ObjectId(session['user_id']),
            'company_name': session['user_name'],
            'title': data['title'],
            'description': data['description'],
            'required_skills': data['required_skills'],
            'required_experience': data['required_experience'],
            'min_cgpa': float(data.get('min_cgpa', 0)),
            'min_hsc': float(data.get('min_hsc', 0)),
            'min_ssc': float(data.get('min_ssc', 0)),
            'required_course': data.get('required_course', ''),
            'posted_at': datetime.datetime.utcnow()
        }
        
        result = jobs.insert_one(job)
        return jsonify({'message': 'Job posted', 'id': str(result.inserted_id)}), 201

@app.route('/api/jobs/apply/<job_id>', methods=['POST'])
def apply_job(job_id):
    if session.get('user_type') != 'employee':
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Check if already applied
    existing = applications.find_one({
        'job_id': ObjectId(job_id),
        'employee_id': ObjectId(session['user_id'])
    })
    
    if existing:
        return jsonify({'error': 'Already applied'}), 400
    
    job = jobs.find_one({'_id': ObjectId(job_id)})
    employee = employees.find_one({'_id': ObjectId(session['user_id'])})
    
    application = {
        'job_id': ObjectId(job_id),
        'employee_id': ObjectId(session['user_id']),
        'company_id': job['company_id'],
        'employee_name': employee['name'],
        'employee_email': employee['email'],
        'employee_skills': employee['skills'],
        'applied_at': datetime.datetime.utcnow(),
        'status': 'pending'
    }
    
    applications.insert_one(application)
    return jsonify({'message': 'Application submitted'}), 201

@app.route('/api/employee/applications', methods=['GET'])
def get_employee_applications():
    if session.get('user_type') != 'employee':
        return jsonify({'error': 'Unauthorized'}), 401

    employee_apps = list(applications.find({'employee_id': ObjectId(session['user_id'])}))
    return jsonify(serialize_docs(employee_apps)), 200

@app.route('/api/employee/invitations', methods=['GET'])
def get_employee_invitations():
    if session.get('user_type') != 'employee':
        return jsonify({'error': 'Unauthorized'}), 401

    invites = list(invitations.find({'employee_id': ObjectId(session['user_id'])}))
    return jsonify(serialize_docs(invites)), 200

@app.route('/api/learning-assistance', methods=['POST'])
def learning_assistance():
    data = request.get_json()
    query = data.get('query', '').strip()
    if not query:
        return jsonify({'error': 'Query text required'}), 400

    # For example, the 'sourceText' is taken as empty or can be expanded
    # Here you can customize sourceText as per user, for now left blank
    payload = {
        "sourceText": "-",  # can be resume or skills from user profile, here blank for simplicity
        "targetText": query,  # job description or skill user typed
        "sourceType": "resume",
        "targetType": "job_description"
    }

    url = "https://skill-parser-api.p.rapidapi.com/v1/skills/gap-analysis"
    headers = {
        "x-rapidapi-key": "--your-rapidapi-key-here-",
        "x-rapidapi-host": "skill-parser-api.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        result_json = response.json()
        result_json = result_json.get('gap_analysis', {}).get('recommendations', [])
        print("API Response:", result_json)  
        return jsonify({'suggestions': result_json})
    except Exception as e:
        return jsonify({'error': 'Failed to get learning assistance', 'details': str(e)}), 500
    

@app.route('/api/company/invitations', methods=['GET'])
def get_company_invitations():
    if session.get('user_type') != 'company':
        return jsonify({'error': 'Unauthorized'}), 401

    company_id = ObjectId(session['user_id'])
    invites = list(invitations.find({'company_id': company_id}))
    
    # Assuming you have the serialize_docs function that converts ObjectIds to strings
    return jsonify(serialize_docs(invites)), 200

# Company Routes
@app.route('/api/company/profile', methods=['GET', 'PUT'])
def company_profile():
    if session.get('user_type') != 'company':
        return jsonify({'error': 'Unauthorized'}), 401
    
    if request.method == 'GET':
        company = companies.find_one({'_id': ObjectId(session['user_id'])})
        if company:
            company.pop('password')
            return jsonify(serialize_doc(company)), 200
        return jsonify({'error': 'Company not found'}), 404
    
    elif request.method == 'PUT':
        data = request.get_json()
        data.pop('_id', None)
        data.pop('password', None)
        
        companies.update_one(
            {'_id': ObjectId(session['user_id'])},
            {'$set': data}
        )
        return jsonify({'message': 'Profile updated successfully'}), 200

@app.route('/api/company/jobs', methods=['GET'])
def get_company_jobs():
    if session.get('user_type') != 'company':
        return jsonify({'error': 'Unauthorized'}), 401
    
    company_jobs = list(jobs.find({'company_id': ObjectId(session['user_id'])}))
    return jsonify(serialize_docs(company_jobs)), 200

@app.route('/api/employees/search', methods=['GET'])
def search_employees():
    if session.get('user_type') != 'company':
        return jsonify({'error': 'Unauthorized'}), 401
    
    skills_filter = request.args.get('skills', '')
    experience_filter = request.args.get('experience', '')
    gender_filter = request.args.get('gender', '')
    
    query = {}
    if skills_filter:
        skills_list = [skill.strip() for skill in skills_filter.split(',')]
        query['skills'] = {'$in': skills_list}
    
    if experience_filter:
        query['experience'] = {'$regex': experience_filter, '$options': 'i'}
    
    if gender_filter:
        query['gender'] = gender_filter
    
    employee_list = list(employees.find(query, {'password': 0}))
    return jsonify(serialize_docs(employee_list)), 200

@app.route('/api/send-invitation', methods=['POST'])
def send_invitation():
    if session.get('user_type') != 'company':
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    employee_id = data['employee_id']
    
    # Check if invitation already sent
    existing = invitations.find_one({
        'employee_id': ObjectId(employee_id),
        'company_id': ObjectId(session['user_id'])
    })
    
    if existing:
        return jsonify({'error': 'Invitation already sent'}), 400
    
    invitation = {
        'employee_id': ObjectId(employee_id),
        'company_id': ObjectId(session['user_id']),
        'company_name': session['user_name'],
        'job_title': data.get('job_title', 'Job Opportunity'),
        'message': data.get('message', ''),
        'sent_at': datetime.datetime.utcnow(),
        'status': 'pending'
    }
    
    invitations.insert_one(invitation)
    return jsonify({'message': 'Invitation sent'}), 201

@app.route('/api/company/applications', methods=['GET'])
def get_company_applications():
    if session.get('user_type') != 'company':
        return jsonify({'error': 'Unauthorized'}), 401
    
    company_apps = list(applications.find({'company_id': ObjectId(session['user_id'])}))
    return jsonify(serialize_docs(company_apps)), 200

    
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)