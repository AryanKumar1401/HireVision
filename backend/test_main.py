import unittest
from sentiment import generate_behavioral_scores
from unittest.mock import patch, MagicMock
import json

def test_generate():
    return generate_behavioral_scores("I'm quite confident in my abilities. I have a clear vision of what I want to achieve, and I'm enthusiastic about the opportunities ahead. I believe in leading by example and fostering teamwork.")


if __name__ == "__main__":
    res = test_generate()
    print(res['confidence'])