import sqlite3


def insert_multiple_responses(data):
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()

    # Ensure table exists
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            answer TEXT
        )
    """
    )

    cursor.executemany("INSERT INTO responses (question, answer) VALUES (?, ?)", data)

    conn.commit()
    conn.close()
    print(f"Inserted {len(data)} questions successfully.")


# Example usage: list of tuples (question, answer)
data = [
    (
        "ماهي رؤية القسم؟",
        "تقديم برنامج أكاديميى مميز فى مجال تكنولوجيا المعلومات وتطبيقاتها فى مجال المكتبات والمعلومات",
    ),
    (
        "What Department Vision?",
        "Offering a distinguished academic program in the field of information technology and its applications in libraries and information science",
    ),
    (
        "ماهو قسم تقنية المعلومات و المكتبات؟",
        "برنامج تقنية المعلومات و المكتبات برنامج اكاديمي متميز يهدف الى :- تأهيل كوادر مهنية في مجال تكنولوجيا المكتبات و المعلومات والتي تلبى احتياجات ومتطلبات سوق العمل - مواكبة التطورات و التحديثات المتسارعه في مجال تكنولوجيا المعلومات وتقييم وتبني المفيد منها مما يسهم في تطور مرافق المعلومات - اكساب الطلاب مهارات التعامل مع الميتاداتا وشبكات المعلومات وتصميم وانشاء مواقع على الانترنت وامن المعلومات وتجهيز ومعالجة المعلومات وتصميم وتحليل النظم الالية ......الخ - تمكين الطلاب من بناء وادارة وتنظيم المحتوى المعلوماتي الرقمي في مرافق المعلومات - اكساب الطلاب مهارات التعامل مع البيئة الرقمية واستخدامها في تنظيم وادارة المعلومات - الدرجة العلمية : يمنح البرنامج درجة الليسانس في تقنية المعلومات و المكتبات بنظام الساعات المعتمده - القيد و القبول : يستهدف البرنامج الطلاب الحاصلين على الثانوية العامة او ما يعادلها والذين تنطبق عليهم شروط الالتحاق بكلية الاداب - نظام الدراسة : للحصول على درجة الليسانس في تقنية المعلومات و المكتبات بنظام الساعات المعتمده يجب ان يجتاز الطالب 139 ساعة معتمده شاملة لمتطلبات الجامعة ومتطلبات الكلية ومتطلبات التخصص وفقا لنظام الفصول الدراسية - الفرص الوظيفية للخريجين : يمكن لخريجي البرنامج العمل في القطاع الحكومي و الخاص في الكثير من المجالات ومنها ادارة وتصميم و تحليل النظم الالية والتعامل مع شبكات المعلومات وتصميم وانشاء مواقع على الانترنت وامن المعلومات وتجهيز ومعالجة المعلومات و الميتاداتا ......الخ",
    ),
    (
        "What is the department of information technology and libraries?",
        "Information Technology and Libraries Program: Program Description: The Information Technology and Libraries Program is a distinguished academic program designed to: Develop qualified professionals in the field of library and information technology, meeting the demands of the modern job market - Keep pace with rapid advancements and updates in information technology, evaluating and adopting beneficial innovations to enhance information facilities - Equip students with skills in metadata management, information networks, website design and development, information security, information processing, and automated systems design and analysis among others - Enable students to navigate and utilize the digital environment for effective information management - Academic Degree: The Program grants a Bachelor's degree in information technology and libraries, based on a credit hour system - Admission Requirements: The Program targets students holding a general secondary education certificate or its equivalent who meet the admission criteria of the Faculty of Arts - Study System: To obtain the Bachelor's degree in information technology and libraries under the credit hour system, students must complete 139 credit hours, including university, faculty, and specialization requirements, according to the semester system - Career Opportunities for Graduates: Graduates of the program can pursue careers in both the public and private sectors in various fields, including: 1- Automated system management, design, and analysis 2- Information network management 3- Website design and development 4- Information security 5- Information processing and metadata management and many other related fields",
    ),
    (
        "ماهي رسالة القسم؟",
        "تأهيل كوادر مهنية في مجال المعلومات و تكنولوجياتها والتي تلبى احتياجات السوق",
    ),
    (
        "What is the mission of the department?",
        "To qualify professional cadres in the field of information and its technologies, meeting the needs of the labor market",
    ),
    (
        "ماهي اهداف البرنامج؟",
        "يهدف برنامج تقنية المعلومات والمكتبات الى : - تحقيق المعرفة العلمية في مجال نظم المعلومات و تكنولوجياتها التي تمكن الطلاب من المشاركة في التعلم مدى الحياة - تمكين الطلاب من التصرف كمهنيين محترفين مسؤولين ومواطنين مدركين للمسؤوليات الاخلاقية و المشكلات المجتمعية وآلية حلها - مواكبة التطورات و التحديثات المتسارعة في مجال تكنولوجيا المعلومات وتقييم وتبني المفيد منها مما يسهم في تطور مرافق المعلومات - تمكين الطلاب من بناء وادارة وتنظيم المحتوى المعلوماتي الرقمي في انظمة تكنولوجيا المعلومات المتوافرة في مرافق المعلومات - اكساب الطلاب المهارات اللازمة للتواصل مع الاخرين علي مستوى العلاقات الشخصية, او العامة, او المهنية",
    ),
    (
        "What are the program objectives?",
        "Objectives of the Information Technology and Libraries Program: 1- Achieve scientific knowledge in the field of information systems and technologies, enabling students to engage in lifelong learning 2- Empower students to act as responsible professionals and informed citizens, aware of ethical responsibilities, societal issues, and their resolution 3- Keep pace with rapid advancements and updates in information technology, evaluating and adopting beneficial innovations to enhance information facilities 4- Enable students to build, manage, and organize digital information content within information technology systems available in information facilities 5- Equip students with the necessary skills to communicate with others on personal, public, and professional levels",
    ),
    (
        "رابط النتيجة؟",
        "https://www.facebook.com/Tanta.Arts?mibextid=LQQJ4d",
    ),
    (
        "Results Link?",
        "https://www.facebook.com/Tanta.Arts?mibextid=LQQJ4d",
    ),
]

insert_multiple_responses(data)
