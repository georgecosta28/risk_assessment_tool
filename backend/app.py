from flask import Flask
from flask_cors import CORS
from auth import auth_bp
from company import company_bp
from assessment import assessment_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret'
CORS(app)

# Register routes
app.register_blueprint(auth_bp)
app.register_blueprint(company_bp)
app.register_blueprint(assessment_bp)

if __name__ == '__main__':
   app.run(debug=True)
#if __name__ == "__main__":
 #   port = int(os.environ.get("PORT", 5000))
  #  app.run(host="0.0.0.0", port=port)