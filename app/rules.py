import re
from typing import Dict, Any, List

URL_PATTERN = re.compile(r"https?://[^\s]+", re.IGNORECASE)
SHORT_URL_PATTERN = re.compile(r"\b(bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy)\b", re.IGNORECASE)
SUSPICIOUS_URL_PATTERN = re.compile(r"https?://(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|https?://[^\s]+\.(xyz|top|site|free|pw|cc|ng|tk|ml)\b|ngrok\.io|loca\.lt|temp-mail", re.IGNORECASE)
UPI_PATTERN = re.compile(r"\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{3,64}\b", re.IGNORECASE)

# Compile regexes once for maximum efficiency
RULES = [
    (
        "otp", 
        60, 
        re.compile(r"\b(otp|pin|cvv|password)\b.*\b(share|send|tell|bata|batao|de do|sang)|\b(share|send|tell|bata|batao)\b.*\b(otp|pin|cvv)\b|(otp|pin).*(सांगा|बताएं)", re.IGNORECASE | re.DOTALL), 
        "Asks you to share an OTP, PIN or CVV. Real banks never ask for these."
    ),
    (
        "digital_arrest", 
        70, 
        re.compile(r"digital arrest|stay on (the )?video call|cbi|narcotics|money laundering|arrest warrant|डिजिटल अरेस्ट", re.IGNORECASE | re.DOTALL), 
        "Threatens arrest and keeps you on a call. 'Digital arrest' does not exist in law."
    ),
    (
        "safe_account", 
        65, 
        re.compile(r"safe account|rbi account|verification account|सुरक्षित खाते", re.IGNORECASE | re.DOTALL), 
        "Asks you to move money to a 'safe' account. This is always a scam."
    ),
    (
        "kyc", 
        45, 
        re.compile(r"kyc.*(expire|update|block|suspend)|account.*(blocked|suspended|freeze)|khata block|खाते.*(बंद|ब्लॉक)|kyc.*अपडेट", re.IGNORECASE | re.DOTALL), 
        "Claims your account will be blocked unless you act now."
    ),
    (
        "courier", 
        40, 
        re.compile(r"courier|customs|parcel.*(seized|held|drugs)|fedex|कस्टम", re.IGNORECASE | re.DOTALL), 
        "Says a parcel is held or contains something illegal."
    ),
    (
        "lottery", 
        50, 
        re.compile(r"lottery|you (have )?won|lucky draw|prize|kbc|जिंकले|इनाम", re.IGNORECASE | re.DOTALL), 
        "Says you won a prize you never entered for."
    ),
    (
        "refund", 
        40, 
        re.compile(r"refund.*(upi|link|click|scan)|scan (this )?qr.*receive|collect request", re.IGNORECASE | re.DOTALL), 
        "Asks you to scan or approve something to 'receive' money. Receiving never needs a PIN."
    ),
    (
        "investment", 
        40, 
        re.compile(r"guaranteed (return|profit)|double your money|task.*(earn|commission)|part.?time job.*(earn|daily)", re.IGNORECASE | re.DOTALL), 
        "Promises guaranteed profit. No honest investment does."
    ),
    (
        "urgency", 
        15, 
        re.compile(r"urgent|immediately|within \d+ (min|hour)|abhi|turant|last warning|लगेच|तुरंत|today", re.IGNORECASE | re.DOTALL), 
        "Pressures you to act right now."
    ),
    (
        "electricity", 
        60, 
        re.compile(r"electricity.*(disconnect|cut)|power.*cut|bijli.*(kat|connection)|mahavitaran.*update|bill.*pending.*(update|pay)|light.*kaat", re.IGNORECASE | re.DOTALL), 
        "Threatens to cut your electricity. Official electricity boards don't send such SMS."
    ),
    (
        "remote_access", 
        70, 
        re.compile(r"anydesk|teamviewer|quicksupport|rustdesk|screen share|screen cast", re.IGNORECASE | re.DOTALL), 
        "Asks you to install a screen-sharing app. Scammers use this to control your phone."
    ),
    (
        "family_emergency", 
        50, 
        re.compile(r"lost (my )?phone.*new number|urgent money.*(hospital|accident|police)|send money.*emergency", re.IGNORECASE | re.DOTALL), 
        "Claims a family member is in trouble and needs money quickly. Verify with a call first."
    ),
    (
        "secrecy", 
        20, 
        re.compile(r"don'?t tell|do not tell|keep (this )?secret|kisi ko mat|कोणाला सांगू नका|किसी को न बताएं", re.IGNORECASE | re.DOTALL), 
        "Tells you to keep it secret from family."
    ),
    (
        "phishing", 
        60, 
        re.compile(r"verify your account|login.*(verify|update)|reset your password|unusual login activity", re.IGNORECASE | re.DOTALL), 
        "Tries to trick you into entering your login credentials on a fake site."
    ),
    (
        "crypto", 
        60, 
        re.compile(r"seed phrase|wallet.*(validate|verify|sync)|crypto.*airdrop.*connect|bitcoin.*giveaway|recovery phrase", re.IGNORECASE | re.DOTALL), 
        "Attempts to steal your cryptocurrency or wallet access."
    ),
    (
        "romance", 
        50, 
        re.compile(r"send.*(gift card|steam card|apple card)|need money.*flight.*visit|military.*stuck.*send funds", re.IGNORECASE | re.DOTALL), 
        "Romance scam pattern asking for untraceable funds like gift cards."
    ),
    (
        "job_offer", 
        50, 
        re.compile(r"work from home.*amazon.*flipkart|hiring.*data entry.*registration fee|pay.*deposit.*start job", re.IGNORECASE | re.DOTALL), 
        "Fake job offer asking for an upfront fee or deposit."
    ),
    (
        "toxicity", 
        80, 
        re.compile(r"\b(kill yourself|kys|fag|nigg|retard)\b", re.IGNORECASE | re.DOTALL), 
        "Contains highly toxic or hate-speech language."
    )
]

ACTIONS = {
    "scam": [
        "Do not reply, click any links, or pay any money.",
        "Do not share personal info, passwords, OTPs, or wallet keys.",
        "Block the sender and report the message to the platform.",
        "If you lost money, contact your bank and local cybercrime authorities immediately."
    ],
    "suspicious": [
        "Do not click any links or download attachments.",
        "Verify the sender through a known, official channel (e.g., call the official number).",
        "Ask a trusted colleague or family member before proceeding."
    ],
    "safe": [
        "No obvious scam or toxic signs found. Still, never share sensitive passwords, OTPs, or seed phrases with anyone."
    ]
}

def scan(text: str) -> Dict[str, Any]:
    """
    Analyzes the input text for threat patterns.
    Returns a dictionary containing the verdict, score, main threat type, and reasons.
    """
    if not isinstance(text, str):
        text = str(text)

    # Sanitize inputs that attempt to mask malicious requests
    text_clean = re.sub(r"(do not|don'?t|never)\s+share[^.\n]*", "", text, flags=re.IGNORECASE)
    
    hits: List[str] = []
    score: int = 0
    types: List[str] = []
    
    for threat_type, weight, pattern, reason in RULES:
        if pattern.search(text_clean):
            score += weight
            hits.append(reason)
            types.append(threat_type)
            
    if SUSPICIOUS_URL_PATTERN.search(text_clean):
        score += 35
        hits.append("Contains a highly suspicious link (IP address or risky domain). Do not click.")
    elif SHORT_URL_PATTERN.search(text_clean):
        score += 15
        hits.append("Contains a shortened link that hides where it leads.")
    elif URL_PATTERN.search(text_clean) and score > 0:
        score += 10
        hits.append("Contains a link. Do not open it.")
        
    if UPI_PATTERN.search(text_clean):
        # UPI IDs combined with urgency/secrecy or other flags is very suspicious
        score += 25
        hits.append("Contains a UPI ID. Do not send money without verifying the receiver in person.")
        types.append("payment_request")
        
    score = min(score, 100)
    
    # Prioritize substantive threats over context flags (urgency/secrecy)
    main_type = next((t for t in types if t not in ("urgency", "secrecy")), types[0] if types else None)
    
    if score >= 60:
        verdict = "scam"
    elif score >= 30:
        verdict = "suspicious"
    else:
        verdict = "safe"
        
    return {
        "verdict": verdict,
        "score": score,
        "type": main_type,
        "reasons": hits
    }
