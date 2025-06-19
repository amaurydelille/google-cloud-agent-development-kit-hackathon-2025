from google.cloud import language_v1, bigquery
import json

def run_sentiment_analysis(text: str) -> tuple[float, float]:
    """
    Run sentiment analysis on the given text.
    Returns the sentiment score and magnitude.
    The score is a float between -1 and 1, where -1 is very negative and 1 is very positive.
    The magnitude is a float between 0 and infinity, where 0 is no sentiment and higher values indicate stronger sentiment.
    """
    try:    
        client = language_v1.LanguageServiceClient()
        document = language_v1.Document(content=text, type_=language_v1.Document.Type.PLAIN_TEXT)
        response = client.analyze_sentiment(request={'document': document})
        return response.document_sentiment.score, response.document_sentiment.magnitude
    except Exception as e:
        print(f"Error running sentiment analysis: {e}")
        return None, None

def run_bigquery_query(sql_query: str):
    """
    Run a bigquery query and return the results.
    """
    client = bigquery.Client()
    query_job = client.query(sql_query)
    query_response = query_job.result().to_dataframe().to_json(orient="records")
    print(json.dumps(query_response, indent=4))
    return query_response