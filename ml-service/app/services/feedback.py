import requests

def generate_feedback(data):

    prompt = f"""
    Give professional resume improvement suggestions:
    {data}
    """

    try:
        r = requests.post("http://localhost:11434/api/generate",
            json={"model":"mistral","prompt":prompt,"stream":False})

        return r.json()["response"]

    except:
        return "AI service unavailable"
