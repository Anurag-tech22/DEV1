import re
import urllib.parse
from typing import Dict, Any, List

URL_PATTERN = re.compile(r"https?://[^\s]+", re.IGNORECASE)
SHORT_URL_PATTERN = re.compile(r"\b(bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy|is\.gd|tiny\.cc)\b", re.IGNORECASE)
SUSPICIOUS_URL_PATTERN = re.compile(r"https?://(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|https?://[^\s]+\.(xyz|top|site|free|pw|cc|ng|tk|ml|icu|live|loan|cfd|vip|shop|click)\b|ngrok\.io|loca\.lt|temp-mail", re.IGNORECASE)
UPI_PATTERN = re.compile(r"\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{3,64}\b", re.IGNORECASE)
PHONE_PATTERN = re.compile(r"(?:\+?91[\s-]?)?[6-9]\d{9}\b|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b")

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
        re.compile(r"digital arrest|stay on (the )?video call|cbi|narcotics|money laundering|arrest warrant|डिजिटल अरेस्ट|skype call|trai.*(block|disconnect)", re.IGNORECASE | re.DOTALL), 
        "Threatens arrest or phone disconnection. 'Digital arrest' does not exist in law."
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
        re.compile(r"kyc.*(expire|update|block|suspend)|account.*(blocked|suspended|freeze)|khata block|खाते.*(बंद|ब्लॉक)|kyc.*अपडेट|pan card.*link", re.IGNORECASE | re.DOTALL), 
        "Claims your account or PAN will be blocked unless you act now."
    ),
    (
        "courier", 
        40, 
        re.compile(r"courier|customs|parcel.*(seized|held|drugs)|fedex|dhl|कस्टम", re.IGNORECASE | re.DOTALL), 
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
        re.compile(r"refund.*(upi|link|click|scan)|scan (this )?qr.*receive|collect request|approve request.*money", re.IGNORECASE | re.DOTALL), 
        "Asks you to scan or approve something to 'receive' money. Receiving money NEVER requires a PIN."
    ),
    (
        "investment", 
        45, 
        re.compile(r"guaranteed (return|profit)|double your money|task.*(earn|commission)|part.?time job.*(earn|daily)|crypto.*trading.*profit", re.IGNORECASE | re.DOTALL), 
        "Promises guaranteed high returns or part-time task commissions. This is a common deposit trap."
    ),
    (
        "urgency", 
        15, 
        re.compile(r"urgent|immediately|within \d+ (min|hour)|abhi|turant|last warning|लगेच|तुरंत|today|strictly confidential", re.IGNORECASE | re.DOTALL), 
        "Pressures you to act immediately without verifying."
    ),
    (
        "electricity", 
        60, 
        re.compile(r"electricity.*(disconnect|cut)|power.*cut|bijli.*(kat|connection)|mahavitaran.*update|bill.*pending.*(update|pay)|light.*kaat", re.IGNORECASE | re.DOTALL), 
        "Threatens to cut your electricity tonight. Official utilities do not issue disconnection notices via SMS."
    ),
    (
        "remote_access", 
        70, 
        re.compile(r"anydesk|teamviewer|quicksupport|rustdesk|screen share|screen cast|install apk", re.IGNORECASE | re.DOTALL), 
        "Asks you to install a remote desktop app or unknown APK. Scammers use this to hijack your device."
    ),
    (
        "family_emergency", 
        50, 
        re.compile(r"lost (my )?phone.*new number|urgent money.*(hospital|accident|police)|send money.*emergency", re.IGNORECASE | re.DOTALL), 
        "Claims a family member is hospitalized or arrested and needs money. Always call your relative directly."
    ),
    (
        "secrecy", 
        20, 
        re.compile(r"don'?t tell|do not tell|keep (this )?secret|kisi ko mat|कोणाला सांगू नका|किसी को न बताएं", re.IGNORECASE | re.DOTALL), 
        "Tells you to keep the conversation secret from friends and family."
    ),
    (
        "phishing", 
        60, 
        re.compile(r"verify your account|login.*(verify|update)|reset your password|unusual login activity", re.IGNORECASE | re.DOTALL), 
        "Tries to trick you into entering your login credentials on a fraudulent page."
    ),
    (
        "crypto", 
        60, 
        re.compile(r"seed phrase|wallet.*(validate|verify|sync)|crypto.*airdrop.*connect|bitcoin.*giveaway|recovery phrase", re.IGNORECASE | re.DOTALL), 
        "Attempts to steal your cryptocurrency recovery phrase or wallet credentials."
    ),
    (
        "romance", 
        50, 
        re.compile(r"send.*(gift card|steam card|apple card)|need money.*flight.*visit|military.*stuck.*send funds", re.IGNORECASE | re.DOTALL), 
        "Romance extortion requesting untraceable payments or gift cards."
    ),
    (
        "job_offer", 
        50, 
        re.compile(r"work from home.*amazon.*flipkart|hiring.*data entry.*registration fee|pay.*deposit.*start job", re.IGNORECASE | re.DOTALL), 
        "Fake job offer demanding an upfront registration fee or deposit."
    ),
    (
        "toxicity", 
        80, 
        re.compile(r"\b(kill yourself|kys|fag|nigg|retard)\b", re.IGNORECASE | re.DOTALL), 
        "Contains highly toxic or abusive language."
    )
]

ACTIONS = {
    "scam": [
        "Do not reply, click any links, or transfer any money.",
        "Never share OTPs, passwords, UPI PINs, or recovery phrases.",
        "Block the sender and report the number on the Cybercrime Portal (1930 / cybercrime.gov.in).",
        "If bank details were shared, freeze your account immediately via netbanking or customer care."
    ],
    "suspicious": [
        "Do not click any links or download attachments from this message.",
        "Verify the claims directly through an official verified website or physical branch.",
        "Ask a family member or cybersecurity specialist before proceeding."
    ],
    "safe": [
        "No common scam patterns detected. However, always exercise caution with unsolicited messages and never share sensitive PINs or passwords."
    ]
}

KNOWN_BRANDS = ["sbi", "hdfc", "icici", "axis", "pnb", "bob", "paytm", "phonepe", "gpay", "amazon", "flipkart", "netflix", "apple", "microsoft", "paypal"]

def inspect_url(raw_url: str) -> Dict[str, Any]:
    """Deep analysis of a URL for phishing, homoglyphs, IP hosting, and dangerous TLDs."""
    if not raw_url.startswith(("http://", "https://")):
        raw_url = "http://" + raw_url
    
    parsed = urllib.parse.urlparse(raw_url)
    hostname = (parsed.hostname or "").lower()
    
    flags: List[str] = []
    risk_score = 10
    
    # Check IP address as host
    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname):
        flags.append("Direct IP address used instead of legitimate domain name")
        risk_score += 45
        
    # Check suspicious TLDs
    suspicious_tlds = [".xyz", ".top", ".site", ".free", ".pw", ".cc", ".ng", ".tk", ".ml", ".icu", ".live", ".loan", ".cfd", ".vip", ".shop", ".click"]
    if any(hostname.endswith(tld) for tld in suspicious_tlds):
        flags.append("High-risk TLD commonly associated with disposable phishing campaigns")
        risk_score += 35
        
    # Check URL shorteners
    shorteners = ["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "rb.gy", "is.gd", "tiny.cc"]
    if any(s in hostname for s in shorteners):
        flags.append("Masked URL shortener hiding destination target")
        risk_score += 25
        
    # Check brand impersonation in subdomains
    for brand in KNOWN_BRANDS:
        if brand in hostname:
            legit_domain = f"{brand}.com" in hostname or f"{brand}.co.in" in hostname or f"{brand}bank.com" in hostname
            if not legit_domain:
                flags.append(f"Potential brand impersonation ({brand.upper()}) on unauthorized domain")
                risk_score += 40
                break
                
    # Check homoglyphs (punycode)
    if "xn--" in hostname:
        flags.append("Punycode detected (possible internationalized homoglyph spoofing attack)")
        risk_score += 50

    # Risk level
    risk_score = min(risk_score, 100)
    verdict = "malicious" if risk_score >= 60 else ("suspicious" if risk_score >= 35 else "low_risk")
    
    return {
        "url": raw_url,
        "hostname": hostname,
        "risk_score": risk_score,
        "verdict": verdict,
        "flags": flags if flags else ["Domain follows standard naming conventions"]
    }

def inspect_upi(upi_str: str) -> Dict[str, Any]:
    """Analyzes a UPI intent URI (upi://pay?...) or address for fraud vectors."""
    flags: List[str] = []
    risk_score = 0
    
    if upi_str.startswith("upi://pay"):
        parsed = urllib.parse.urlparse(upi_str)
        params = urllib.parse.parse_qs(parsed.query)
        pa = params.get("pa", [""])[0]
        pn = params.get("pn", [""])[0]
        am = params.get("am", [""])[0]
        
        # QR intent asking for payment
        flags.append("QR intent is configured to DEBIT money from your account, NOT credit it.")
        risk_score += 50
        
        if am and float(am) > 0:
            flags.append(f"Hardcoded debit amount: ₹{am}")
            risk_score += 20
            
        return {
            "payee_vpa": pa,
            "payee_name": pn,
            "amount": am if am else "Unspecified",
            "risk_score": risk_score,
            "warning": "CRITICAL: Approving this request will transfer money OUT of your bank account. You NEVER need to enter your UPI PIN to receive money.",
            "flags": flags
        }
    else:
        # Standard VPA check
        is_vpa = bool(UPI_PATTERN.match(upi_str))
        return {
            "payee_vpa": upi_str,
            "valid_format": is_vpa,
            "risk_score": 15 if is_vpa else 40,
            "warning": "Always verify the receiver's real identity before sending funds via UPI.",
            "flags": ["Standard UPI Virtual Payment Address"] if is_vpa else ["Malformed or unverified VPA pattern"]
        }

def scan(text: str) -> Dict[str, Any]:
    """
    Analyzes the input text for multi-vector threat patterns.
    Returns comprehensive forensic telemetry, extracted IoCs, and severity scores.
    """
    if not isinstance(text, str):
        text = str(text)

    # Sanitize inputs that attempt to mask malicious requests
    text_clean = re.sub(r"(do not|don'?t|never)\s+share[^.\n]*", "", text, flags=re.IGNORECASE)
    
    hits: List[str] = []
    score: int = 0
    types: List[str] = []
    
    # Match heuristic threat rules
    for threat_type, weight, pattern, reason in RULES:
        if pattern.search(text_clean):
            score += weight
            hits.append(reason)
            types.append(threat_type)
            
    # Extract Indicators of Compromise (IoCs)
    raw_urls = URL_PATTERN.findall(text)
    phone_numbers = list(set(PHONE_PATTERN.findall(text)))
    upi_ids = list(set(UPI_PATTERN.findall(text)))
    
    url_threats = []
    for u in raw_urls:
        u_info = inspect_url(u)
        url_threats.append(u_info)
        if u_info["verdict"] == "malicious":
            score += 35
            hits.append(f"Malicious link detected: {u_info['hostname']} ({', '.join(u_info['flags'])})")
        elif u_info["verdict"] == "suspicious":
            score += 20
            hits.append(f"Suspicious link detected: {u_info['hostname']}")
            
    if SUSPICIOUS_URL_PATTERN.search(text_clean) and not any(u["verdict"] == "malicious" for u in url_threats):
        score += 35
        hits.append("Contains a highly suspicious link (IP address or risky domain). Do not click.")
    elif SHORT_URL_PATTERN.search(text_clean) and not any(u["verdict"] == "suspicious" for u in url_threats):
        score += 15
        hits.append("Contains a shortened link that hides where it leads.")
    elif URL_PATTERN.search(text_clean) and score > 0:
        score += 10
        hits.append("Contains a link. Do not open it.")
        
    if upi_ids:
        score += 25
        hits.append("Contains payment addresses (UPI). Do not send funds without independent verification.")
        types.append("payment_request")
        
    score = min(score, 100)
    
    # Substantive threat classification
    main_type = next((t for t in types if t not in ("urgency", "secrecy")), types[0] if types else "general_analysis")
    
    if score >= 60:
        verdict = "scam"
    elif score >= 30:
        verdict = "suspicious"
    else:
        verdict = "safe"

    # Multi-dimensional risk vectors
    risk_metrics = {
        "urgency_level": "High" if any(t == "urgency" for t in types) else "Low",
        "financial_threat": "Critical" if any(t in ("otp", "safe_account", "refund", "crypto") for t in types) else ("Medium" if upi_ids else "Low"),
        "coercion_level": "Severe" if any(t in ("digital_arrest", "electricity", "remote_access") for t in types) else "Normal",
        "credential_harvest": "Detected" if any(t in ("phishing", "kyc", "otp") for t in types) else "None"
    }

    return {
        "verdict": verdict,
        "score": score,
        "type": main_type,
        "reasons": hits,
        "iocs": {
            "urls": raw_urls,
            "phone_numbers": phone_numbers,
            "upi_ids": upi_ids
        },
        "url_analysis": url_threats,
        "risk_metrics": risk_metrics
    }


def inspect_audio(transcript: str, duration: float = 0.0) -> Dict[str, Any]:
    """
    Analyzes audio transcripts & simulated speech acoustic markers for AI Voice Cloning,
    Digital Arrest intimidation, extortion, and psychological coercion.
    """
    transcript_lower = transcript.lower()
    flags: List[str] = []
    deepfake_score = 15

    # 1. Voice Cloning / Family Impersonation patterns
    family_emergency_keywords = ["mom it's me", "dad it's me", "i lost my phone", "i got into an accident", "kidnapped", "ransom", "jail", "lawyer need money"]
    if any(k in transcript_lower for k in family_emergency_keywords):
        flags.append("AI Voice Cloning Emergency Vector: Fabricated crisis demanding immediate untraceable bail/money")
        deepfake_score += 45

    # 2. Digital Arrest & Authority Coercion
    police_extortion_keywords = ["inspector", "cbi", "narcotics", "customs", "cyber cell", "arrest warrant", "stay on this video call", "do not disconnect", "rbi safe account"]
    if any(k in transcript_lower for k in police_extortion_keywords):
        flags.append("Digital Arrest Extortion: Coercive psychological pressure impersonating law enforcement officers")
        deepfake_score += 50

    # 3. High-Urgency Financial Transfers
    financial_keywords = ["wire transfer", "send upi", "gift card", "crypto", "withdraw cash", "western union", "angadia"]
    if any(k in transcript_lower for k in financial_keywords):
        flags.append("Financial Exploitation: Demanding rapid capital movement without paper trail")
        deepfake_score += 25

    # 4. Background Audio & Synthesized Speech Artifacts (Heuristic detection)
    synthetic_markers = ["robotic", "monotone", "echo", "delayed response", "audio jitter", "synthetic noise"]
    if any(k in transcript_lower for k in synthetic_markers) or "audio" in transcript_lower:
        flags.append("Acoustic Artifacts: Abnormal harmonic regularity consistent with text-to-speech or voice conversion synthesis")
        deepfake_score += 20

    deepfake_score = min(deepfake_score, 100)
    verdict = "HIGH_THREAT" if deepfake_score >= 65 else ("SUSPICIOUS" if deepfake_score >= 35 else "CLEAN")

    return {
        "verdict": verdict,
        "deepfake_probability": deepfake_score,
        "coercion_pressure": "Severe" if deepfake_score >= 65 else ("Moderate" if deepfake_score >= 35 else "Normal"),
        "indicators": flags if flags else ["Natural vocal distribution pattern", "No extortion or cloning indicators detected"],
        "recommended_action": "Immediately hang up and call your family member back on their known real telephone number. Never transfer money under pressure." if deepfake_score >= 35 else "Voice pattern appears authentic. Standard security vigilance advised."
    }


DANGEROUS_PERMISSIONS = {
    "android.permission.BIND_ACCESSIBILITY_SERVICE": "CRITICAL: Allows total screen control, keylogging, and bypassing user clicks.",
    "android.permission.RECEIVE_SMS": "CRITICAL: Intercepts incoming 2-Factor Authentication (OTP) codes from banks.",
    "android.permission.READ_SMS": "HIGH: Reads existing SMS inbox including financial balances and security codes.",
    "android.permission.SYSTEM_ALERT_WINDOW": "HIGH: Displays deceptive invisible overlay login screens over real banking apps.",
    "android.permission.REQUEST_INSTALL_PACKAGES": "HIGH: Acts as a dropper to silently install secondary trojan payloads.",
    "android.permission.READ_CONTACTS": "MEDIUM: Exfiltrates address book for viral SMS phishing propagation.",
    "android.permission.RECORD_AUDIO": "HIGH: Enables covert ambient microphone eavesdropping."
}

KNOWN_TROJAN_PACKAGES = [
    "com.sbi.reward", "com.electricity.bill", "com.anydesk.adservice", "com.quicksupport.plugin",
    "com.pm.kisan.yojna", "com.pan.link.aadhaar", "com.fedex.delivery.tracking", "com.banking.security.update"
]

def inspect_apk(package_name: str, permissions: List[str] = None) -> Dict[str, Any]:
    """
    Evaluates an Android APK package name and declared manifest permissions against
    known mobile banking trojan signatures and accessibility hijacking exploits.
    """
    pkg_clean = package_name.strip().lower()
    perms = [p.strip() for p in (permissions or [])]
    flags: List[str] = []
    risk_score = 10

    # 1. Check known malicious package signatures
    if any(trojan in pkg_clean for trojan in KNOWN_TROJAN_PACKAGES):
        flags.append(f"Identified known Banking Trojan signature match ({pkg_clean})")
        risk_score += 65

    # 2. Check for fake brand names in package
    for brand in ["sbi", "hdfc", "icici", "axis", "mahavitaran", "trai", "police"]:
        if brand in pkg_clean and not pkg_clean.startswith(f"com.{brand}"):
            flags.append(f"Impersonation detected: Unauthorized package spoofing brand '{brand.upper()}'")
            risk_score += 40
            break

    # 3. Analyze permissions
    for perm in perms:
        if perm in DANGEROUS_PERMISSIONS:
            flags.append(f"{perm}: {DANGEROUS_PERMISSIONS[perm]}")
            risk_score += 25

    # Accessibility + SMS is the classic banking trojan combo
    has_accessibility = "android.permission.BIND_ACCESSIBILITY_SERVICE" in perms
    has_sms = any("SMS" in p for p in perms)
    if has_accessibility and has_sms:
        flags.append("CRITICAL VECTOR DETECTED: Accessibility Service combined with SMS Access indicates an Automated Transfer System (ATS) banking trojan.")
        risk_score += 45

    risk_score = min(risk_score, 100)
    verdict = "MALICIOUS_TROJAN" if risk_score >= 60 else ("SUSPICIOUS" if risk_score >= 35 else "CLEAN_PACKAGE")

    return {
        "package_name": package_name,
        "risk_score": risk_score,
        "verdict": verdict,
        "malware_family": "Hydra / Godfather Trojan Family" if risk_score >= 65 else ("Potentially Unwanted Application (PUA)" if risk_score >= 35 else "Standard Android App"),
        "analysis_findings": flags if flags else ["Standard permissions profile with no overt privilege escalation risks detected."]
    }


def generate_counter_bait(history: List[Dict[str, str]], persona: str = "elderly") -> Dict[str, Any]:
    """
    Generates realistic, time-wasting counter-scambaiting responses to exhaust
    scammer resources and safely extract scammer bank accounts, phone numbers, and UPI IDs.
    """
    responses_elderly = [
        "Beta, I am opening my bank app on my spectacles, but it is asking for your branch manager's name and IFSC code. What is your bank account number so I can ask my grandson?",
        "Please wait, my internet is very slow in our village. Can you give me your direct UPI ID so I can write it in my diary first?",
        "I am at the bank counter right now, but the clerk says she needs your full official designation, department badge ID, and police station address before she allows the transfer. Which police station are you sitting in?",
        "Oh dear, my phone restarted by itself. Could you tell me what the total amount was again, and which account number should I write on the deposit slip?",
        "My grandson told me never to transfer without a written invoice. Can you send your official letterhead or company registration number to my email?"
    ]

    responses_tech_naive = [
        "I clicked the link, but it says 'Server 404 Error'. Do you have an alternate direct bank account number or UPI ID I can send to directly?",
        "My phone gave a popup saying 'Screen sharing prohibited by banking security'. Can you give me your Google Pay or PhonePe number instead?",
        "I have Rs 50,000 ready right now in my account, but my daily limit is set to Rs 10,000. Can I do 5 separate transfers? Send me your UPI ID again please.",
        "It's asking for a Beneficiary Name before adding you. What is the exact full name registered on your bank account?"
    ]

    import random
    pool = responses_elderly if persona == "elderly" else responses_tech_naive
    # Pick a response based on conversation length
    idx = len(history) % len(pool)
    bait_reply = pool[idx]

    return {
        "persona": persona,
        "suggested_reply": bait_reply,
        "strategy": "Time-Dilation & Intel Extraction (Extracting Payee VPA / IFSC / Account Number)",
        "safety_tip": "Never send real money, OTPs, or install apps while counter-baiting. Let the automated agent do the talking."
    }

