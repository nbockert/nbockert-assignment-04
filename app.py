from flask import Flask, render_template, request, jsonify
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

app = Flask(__name__)


# TODO: Fetch dataset, initialize vectorizer and LSA here
newsgroups = fetch_20newsgroups(subset='all')
documents = newsgroups.data
vectorizer = TfidfVectorizer(stop_words='english', min_df=4,max_df=0.8)
X_tfidf = vectorizer.fit_transform(documents)
n_components = 100  # Number of dimensions to reduce to
svd = TruncatedSVD(n_components=n_components)
X_lsa = svd.fit_transform(X_tfidf)  # Reduced-dimensionality matrix

def search_engine(query):
    """
    Function to search for top 5 similar documents given a query
    Input: query (str)
    Output: documents (list), similarities (list), indices (list)
    """
    # Step 1: Transform the query using the TF-IDF vectorizer
    query_tfidf = vectorizer.transform([query])
    
    # Step 2: Project the query into the LSA space
    query_lsa = svd.transform(query_tfidf)
    
    # Step 3: Compute cosine similarities between the query and all documents
    similarities = cosine_similarity(query_lsa, X_lsa)[0]
    
    # Step 4: Get the top 5 most similar documents
    top_indices = np.argsort(similarities)[-5:][::-1]  # Indices of top 5 documents
    top_documents = [documents[i] for i in top_indices]  # Retrieve top documents
    top_similarities = [similarities[i] for i in top_indices]  # Retrieve top similarities
    
    return top_documents, np.array(top_similarities), top_indices


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form['query']
    documents, similarities, indices = search_engine(query)
    # print("documents:",documents)
    print("similarities:",similarities)
    print("indicies:",indices)
    similarities = similarities.tolist()
    indices = indices.tolist()
    return jsonify({'documents': documents,'similarities': similarities, 'indices': indices}) 

if __name__ == '__main__':
    app.run(debug=True, port=3000)
