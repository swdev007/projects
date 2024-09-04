import json
from textblob import TextBlob
import textstat


def lambda_handler(event, context):
    test_data = json.loads(event["body"]).get("text")

    def numerical_data_density(text):
        total_characters = len(text)
        numerical_characters = sum(char.isdigit() for char in text)

        if total_characters == 0:
            return 0  # To avoid division by zero if the input string is empty

        percentage = (numerical_characters / total_characters) * 100
        return percentage

    def textblob_polarity(sentence):
        blob = TextBlob(sentence)
        return blob.sentiment.polarity

    def textblob_subjectivity(sentence):
        blob = TextBlob(sentence)
        return blob.sentiment.subjectivity

    all_metrics = {
        "character_count": textstat.char_count(test_data),
        # Word count - Directly from the words
        "wordCount": textstat.lexicon_count(test_data),
        # Readability - flesh_kincaid
        "readability": (
            textstat.flesch_kincaid_grade(test_data)
            if textstat.flesch_kincaid_grade(test_data) > 0
            else 0
        ),
        # Data Density - numerical_density
        "dataDensity": numerical_data_density(test_data),
        # Sentiment score - textblob_polarity - After analyse text
        "sentimentCount": textblob_polarity(test_data),
        # Subjectivity score - textblob_subjectivity - After analyse text
        "subjectivityCount": textblob_subjectivity(test_data),
    }
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": json.dumps(all_metrics),
    }
