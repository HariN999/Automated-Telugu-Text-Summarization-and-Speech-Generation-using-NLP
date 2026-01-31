import re

def normalize_text(text):
    text = text.strip()
    text = re.sub(r"[^\u0C00-\u0C7F\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text


def rouge_n(reference, candidate, n=1):
    ref_tokens = normalize_text(reference).split()
    cand_tokens = normalize_text(candidate).split()

    def ngrams(tokens, n):
        return [tuple(tokens[i:i+n]) for i in range(len(tokens)-n+1)]

    ref_ngrams = ngrams(ref_tokens, n)
    cand_ngrams = ngrams(cand_tokens, n)

    ref_count = {}
    for ng in ref_ngrams:
        ref_count[ng] = ref_count.get(ng, 0) + 1

    overlap = 0
    for ng in cand_ngrams:
        if ng in ref_count and ref_count[ng] > 0:
            overlap += 1
            ref_count[ng] -= 1

    precision = overlap / max(len(cand_ngrams), 1)
    recall = overlap / max(len(ref_ngrams), 1)

    if precision + recall == 0:
        return 0.0
    return 2 * precision * recall / (precision + recall)


def rouge_l(reference, candidate):
    ref = normalize_text(reference).split()
    cand = normalize_text(candidate).split()

    dp = [[0]*(len(cand)+1) for _ in range(len(ref)+1)]

    for i in range(len(ref)):
        for j in range(len(cand)):
            if ref[i] == cand[j]:
                dp[i+1][j+1] = dp[i][j] + 1
            else:
                dp[i+1][j+1] = max(dp[i][j+1], dp[i+1][j])

    lcs = dp[-1][-1]
    precision = lcs / max(len(cand), 1)
    recall = lcs / max(len(ref), 1)

    if precision + recall == 0:
        return 0.0
    return 2 * precision * recall / (precision + recall)


def evaluate_rouge(reference, generated):
    return {
        "ROUGE-1": rouge_n(reference, generated, 1),
        "ROUGE-2": rouge_n(reference, generated, 2),
        "ROUGE-L": rouge_l(reference, generated)
    }