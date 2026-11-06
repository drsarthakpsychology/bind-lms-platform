/* Module · UGC NET Paper 1, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. Dated facts checked November 2026; recheck every exam cycle. */
export const part2 = String.raw`
# Part III · Advanced: ICT, environment and higher education

## 3.1 Information and communication technology (ICT) [core][advanced]
ICT questions mix fixed basics (which never change) with digital initiatives (which change every year). Learn the basics once; recheck the initiatives before each exam.

### Computer basics
- **Hardware:** physical parts. **Input** (keyboard, mouse, scanner, microphone), **output** (monitor, printer, speaker), **processing** (CPU: control unit, arithmetic logic unit, registers) and **storage**.
- **Memory:** **RAM** (random access memory: temporary, **volatile**, lost when power goes off) and **ROM** (read-only: permanent, holds start-up instructions, non-volatile). **Cache** is small, very fast memory near the CPU. **Secondary storage:** hard disk, SSD, pen drive, optical discs, cloud.
- **Units:** 1 nibble = 4 bits; **1 byte = 8 bits**; 1 KB = 1,024 bytes; 1 MB = 1,024 KB; then GB, TB, PB, EB, ZB, YB.
- **Software:** **system software** (operating systems: Windows, macOS, Linux, Android, iOS) and **application software** (word processors, spreadsheets, browsers). **Open-source** software (Linux, LibreOffice, Moodle) has freely available source code; **freeware** is free to use but not necessarily open.
- **Number systems:** binary (base 2), octal (8), decimal (10), hexadecimal (16). Binary 1011 = 8 + 0 + 2 + 1 = 11 in decimal; decimal 25 = 11001 in binary.
- **Generations of computers:** vacuum tubes, transistors, integrated circuits, microprocessors, and the fifth generation built around AI and parallel processing.

### The internet and the web
- The **internet** is the global network of networks; the **World Wide Web** is a service on it, invented by **Tim Berners-Lee** at CERN (proposed in 1989).
- **Protocols:** **TCP/IP** (basic communication), **HTTP/HTTPS** (web pages; the S means secure, encrypted), **FTP** (file transfer), **SMTP** (sending e-mail), **POP3** and **IMAP** (receiving e-mail; IMAP keeps mail synchronised on the server), **DNS** (turns website names into IP addresses).
- **IP addresses:** **IPv4** is 32-bit (for example 192.168.1.1); **IPv6** is 128-bit, written in hexadecimal.
- **URL** (uniform resource locator): protocol, domain, path. **Domains:** .com, .org, .edu, .gov, .ac.in (Indian academic), .nic.in (government), .in (India).
- **Networks:** **PAN** (personal), **LAN** (local area), **MAN** (metropolitan), **WAN** (wide area; the internet is the largest). **Wi-Fi**, **Bluetooth**, **modem**, **router**, **switch**.
- **Browser** (Chrome, Firefox: displays pages) versus **search engine** (Google, Bing: finds pages).
- **Cloud computing:** **IaaS** (infrastructure), **PaaS** (platform), **SaaS** (software, such as Gmail or Google Docs).

### E-mail
- **To:** main recipients. **CC** (carbon copy): others who should see it, visible to all. **BCC** (blind carbon copy): hidden from other recipients.
- **Attachment**, **signature**, **spam**, **draft**, **reply all**, **forward**.
- **Phishing:** fake messages that try to steal passwords or money. Never share an OTP.

### Security
- **Malware:** **virus** (attaches to files, needs a host), **worm** (spreads itself across networks), **Trojan horse** (looks useful, hides harm), **ransomware** (locks files for payment), **spyware**, **adware**.
- Protection: antivirus, **firewall**, updates, strong passwords, **two-factor authentication**, **encryption**, backups. India's national agency for cyber incidents is **CERT-In**; the main law is the **Information Technology Act, 2000**.

### Digital initiatives in higher education (as of November 2026)
| Initiative | What it is |
|---|---|
| **SWAYAM** | National MOOC platform (2017); credit transfer up to 40% of a programme |
| **SWAYAM Prabha** | Educational DTH television channels |
| **NPTEL** | Online courses from IITs and IISc |
| **e-PG Pathshala** | Postgraduate e-content in many subjects (UGC, INFLIBNET) |
| **National Digital Library of India (NDLI)** | A single-window library (developed at IIT Kharagpur) |
| **Shodhganga** | Repository of Indian PhD theses (INFLIBNET) |
| **Shodhgangotri** | Repository of research synopses |
| **Shodh Shuddhi** | Plagiarism-detection software provided to universities |
| **One Nation One Subscription (ONOS)** | National access to thousands of international journals for government institutions, from 1 January 2025, run through INFLIBNET |
| **Vidwan** | Database of experts and researchers |
| **Academic Bank of Credits (ABC)** | Digital store of a student's credits, allowing multiple entry and exit (NEP 2020) |
| **APAAR ID** | "One Nation One Student ID", linked to ABC and DigiLocker |
| **DigiLocker** and **National Academic Depository (NAD)** | Digital storage and verification of degrees and mark sheets |
| **Samarth** | E-governance software for universities |
| **Virtual Labs** | Online laboratory experiments |
| **PM eVidya** | Umbrella for digital and on-air education (2020) |
| **DIKSHA** | Digital platform for school teachers and students |

:::widget sort
{"prompt": "Which is each?", "buckets": ["Hardware or memory", "Protocol or network", "Security threat", "Indian digital initiative"], "items": [{"text": "Volatile memory that loses data when power is off", "bucket": 0, "why": "RAM."}, {"text": "The protocol used to send e-mail", "bucket": 1, "why": "SMTP."}, {"text": "A program that spreads across networks by itself", "bucket": 2, "why": "A worm."}, {"text": "Repository of Indian PhD theses", "bucket": 3, "why": "Shodhganga."}, {"text": "Translates domain names into IP addresses", "bucket": 1, "why": "DNS."}, {"text": "Locks files and demands payment", "bucket": 2, "why": "Ransomware."}, {"text": "A digital store of credits for multiple entry and exit", "bucket": 3, "why": "Academic Bank of Credits."}, {"text": "Read-only memory holding start-up instructions", "bucket": 0}]}
:::

:::recall
1. RAM versus ROM. || RAM: temporary, volatile working memory. ROM: permanent, non-volatile, holds start-up instructions.
2. How many bits in a byte, and bytes in a kilobyte? || 8 bits; 1,024 bytes.
3. Which protocol sends e-mail, and which two receive it? || SMTP sends; POP3 and IMAP receive.
4. What is the difference between CC and BCC? || CC recipients are visible to all; BCC recipients are hidden.
5. How many bits are in IPv4 and IPv6 addresses? || 32 and 128.
6. What does ONOS provide, and from when? || National access to international journals for government higher-education and research institutions, from 1 January 2025.
:::

:::mcq
Q: The binary number 1101 equals the decimal number:
- *13
- 11
- 12
- 15
> 8 + 4 + 0 + 1 = 13.

Q: Which is NOT an input device?
- *Printer
- Scanner
- Keyboard
- Microphone
> A printer is an output device.

Q: A program that disguises itself as useful software but carries hidden harm is a:
- Worm
- Firewall
- Cookie
- *Trojan horse
> Named after the wooden horse of Troy.

Q: Shodhganga is maintained by:
- *INFLIBNET
- NAAC
- AICTE
- NCERT
> INFLIBNET Centre, Gandhinagar.
:::

## 3.2 People, development and environment [core][advanced]

### Development goals
- **Millennium Development Goals (MDGs):** 8 goals, 2000 to 2015.
- **Sustainable Development Goals (SDGs):** adopted by the UN General Assembly in **September 2015** as the 2030 Agenda for Sustainable Development. **17 goals, 169 targets**, to be met by **2030**. Goal 3 is good health and well-being (including mental health and substance use); goal 4 quality education; goal 13 climate action. NITI Aayog publishes India's **SDG India Index**.
- **Sustainable development** was defined in the **Brundtland Report** (1987) of the World Commission on Environment and Development: development that meets the needs of the present without compromising the ability of future generations to meet their own needs.

### Human–environment interaction and pollution
- **Anthropogenic** (human-caused) activities: deforestation, urbanisation, industry, intensive agriculture, mining, fossil fuels.
- **Air pollution:** particulate matter (**PM2.5** and **PM10**), nitrogen oxides, sulphur dioxide, carbon monoxide, ozone, ammonia, lead. India's **National Air Quality Index** (2014) uses these eight pollutants and six bands: good (0 to 50), satisfactory (51 to 100), moderately polluted (101 to 200), poor (201 to 300), very poor (301 to 400) and severe (401 to 500). The **National Clean Air Programme** began in 2019.
- **Water pollution:** sewage, industrial effluents, fertiliser run-off (eutrophication), arsenic and fluoride in groundwater. **Biochemical oxygen demand (BOD)** measures organic pollution.
- **Soil pollution:** pesticides, heavy metals, plastics. **Noise pollution** is measured in decibels.
- **E-waste** is governed by the **E-Waste (Management) Rules, 2022**; India banned identified **single-use plastic** items from **1 July 2022**.
- **Health effects:** respiratory and heart disease, cancers, developmental harm to children, and **mental health effects** (air pollution is linked with depression and cognitive decline; climate change brings heat stress, displacement and "eco-anxiety").

### Energy and natural resources
- **Conventional (non-renewable):** coal, oil, natural gas. **Non-conventional (renewable):** solar, wind, hydro, biomass, geothermal, tidal; nuclear is low-carbon but non-renewable.
- **National Solar Mission** (2010), the **International Solar Alliance** (launched by India and France at COP21 in Paris, 2015; headquartered in Gurugram), the **National Green Hydrogen Mission** (2023) and rooftop solar schemes.
- India reached **50% of its installed electricity capacity from non-fossil sources in 2025**, five years ahead of its 2030 target.

### Climate change and India's commitments
- Greenhouse gases: carbon dioxide, methane, nitrous oxide, HFCs, PFCs, sulphur hexafluoride (the six in the Kyoto Protocol), and nitrogen trifluoride.
- India's **National Action Plan on Climate Change (2008)** has **eight national missions**: solar; enhanced energy efficiency; sustainable habitat; water; sustaining the Himalayan ecosystem; Green India; sustainable agriculture; and strategic knowledge for climate change.
- India's **updated NDC (2022)**: cut the **emissions intensity of GDP by 45% from 2005 levels by 2030**; reach **50% of installed power capacity from non-fossil sources by 2030**; create an additional carbon sink of **2.5 to 3 billion tonnes** of CO2 equivalent through forests and trees; and promote **LiFE** (Lifestyle for Environment). India's goal of **net zero by 2070** was announced at **COP26 (Glasgow, 2021)** as part of the "Panchamrit".

### Natural hazards and disasters
- Hazards: earthquakes, cyclones, floods, droughts, landslides, heatwaves, tsunamis.
- **Disaster Management Act, 2005** set up the **National Disaster Management Authority** (chaired by the Prime Minister) and the **NDRF**.
- **Hyogo Framework** (2005 to 2015) was followed by the **Sendai Framework for Disaster Risk Reduction (2015 to 2030)**, with seven targets and four priorities.
- Psychological first aid and community mental health are part of disaster response (NIMHANS has trained responders for many disasters).

### Indian environmental laws
| Law | Year |
|---|---|
| Wildlife (Protection) Act | 1972 |
| Water (Prevention and Control of Pollution) Act | 1974 |
| Forest (Conservation) Act (amended 2023 and renamed the Van (Sanrakshan Evam Samvardhan) Adhiniyam) | 1980 |
| Air (Prevention and Control of Pollution) Act | 1981 |
| **Environment (Protection) Act** (an umbrella law passed after the Bhopal gas disaster of 1984) | **1986** |
| Biological Diversity Act | 2002 |
| National Green Tribunal Act | 2010 |

The **Constitution** places duties on the state (**Article 48A**: protect and improve the environment) and on citizens (**Article 51A(g)**). Courts read the right to a clean environment into **Article 21** (right to life).

### International agreements
| Agreement | Year | Purpose |
|---|---|---|
| Ramsar Convention | 1971 | Wetlands |
| **Stockholm Conference** (UN Conference on the Human Environment) | **1972** | First global environment conference; created **UNEP**; 5 June became World Environment Day |
| CITES | 1973 | Trade in endangered species |
| Vienna Convention | 1985 | Ozone layer (framework) |
| **Montreal Protocol** | **1987** | Phasing out ozone-depleting substances; **Kigali Amendment (2016)** adds HFCs |
| Basel Convention | 1989 | Movement of hazardous wastes |
| **Rio Earth Summit** (UN Conference on Environment and Development) | **1992** | Produced the **UNFCCC**, the **Convention on Biological Diversity**, **Agenda 21** and the Rio Declaration |
| **Kyoto Protocol** | **1997** (in force 2005) | Binding emission cuts for developed (Annex I) countries; clean development mechanism |
| Rotterdam Convention | 1998 | Prior informed consent for hazardous chemicals |
| Stockholm Convention | 2001 | Persistent organic pollutants |
| Minamata Convention | 2013 | Mercury |
| **Paris Agreement** | **2015** (in force 2016) | Hold warming well below 2°C and pursue 1.5°C; every country submits **nationally determined contributions (NDCs)**; a global stocktake every five years (the first concluded at COP28, Dubai, 2023) |
| Kunming-Montreal Global Biodiversity Framework | 2022 | Including protecting 30% of land and sea by 2030 |

Recent climate summits: **COP29** (Baku, 2024) set a new finance goal of at least **US$300 billion a year by 2035** for developing countries; **COP30** was held in **Belém, Brazil** (November 2025); **COP31** is in **Antalya, Türkiye, 9 to 20 November 2026**, with Australia presiding over the negotiations.

:::widget sort
{"prompt": "Match each agreement to its main purpose.", "buckets": ["Ozone", "Climate", "Biodiversity or wetlands", "Chemicals or waste"], "items": [{"text": "Montreal Protocol (1987)", "bucket": 0}, {"text": "Kyoto Protocol (1997)", "bucket": 1, "why": "Binding cuts in greenhouse gas emissions for developed countries."}, {"text": "Ramsar Convention (1971)", "bucket": 2}, {"text": "Basel Convention (1989)", "bucket": 3}, {"text": "Paris Agreement (2015)", "bucket": 1}, {"text": "Minamata Convention (2013)", "bucket": 3, "why": "Mercury."}, {"text": "Vienna Convention (1985)", "bucket": 0}, {"text": "Convention on Biological Diversity (1992)", "bucket": 2}]}
:::

:::recall
1. How many SDGs and targets are there, and for which year? || 17 goals and 169 targets, for 2030.
2. Which act did India pass after the Bhopal gas disaster? || The Environment (Protection) Act, 1986.
3. Name the eight missions of the NAPCC. || Solar; energy efficiency; sustainable habitat; water; Himalayan ecosystem; Green India; sustainable agriculture; strategic knowledge for climate change.
4. What did the Kigali Amendment add to the Montreal Protocol? || The phase-down of HFCs.
5. What are India's three main updated NDC targets for 2030? || 45% lower emissions intensity of GDP than in 2005; 50% non-fossil installed power capacity; an extra 2.5 to 3 billion tonnes CO2e carbon sink.
6. What period does the Sendai Framework cover? || 2015 to 2030.
:::

:::mcq
Q: The Brundtland Report (1987) is best known for:
- Launching the Sustainable Development Goals
- Creating the UN Environment Programme
- *Defining sustainable development
- Setting binding emission targets
> It defined sustainable development as meeting present needs without compromising future generations.

Q: India's National Air Quality Index treats an AQI of 250 as:
- Satisfactory
- *Poor
- Moderately polluted
- Severe
> 201 to 300 is poor.

Q: The Kyoto Protocol came into force in:
- 1997
- *2005
- 2001
- 2015
> Adopted 1997; in force 2005.

Q: Which constitutional article directs the state to protect and improve the environment?
- Article 21A
- Article 45
- Article 51A(h)
- *Article 48A
> A Directive Principle added by the 42nd Amendment.
:::

## 3.3 Higher education in India: from Takshashila to independence [core][advanced]

### Ancient centres of learning
| Centre | Where | Key facts |
|---|---|---|
| **Takshashila (Taxila)** | Near present-day Rawalpindi, Pakistan | One of the oldest; associated with Chanakya, Panini and the physician Charaka (by tradition); no single campus, teachers taught independently |
| **Nalanda** | Bihar | Founded in the 5th century CE under the Gupta ruler **Kumaragupta I**; a residential Buddhist mahavihara; visited by **Xuanzang** (Hiuen Tsang) and Yijing; destroyed around 1193 (attributed to Bakhtiyar Khilji); a new Nalanda University was set up by an Act of 2010 |
| **Vikramashila** | Bihar | Founded by the Pala king **Dharmapala** (late 8th century); famous for Tantric Buddhism; the scholar **Atisha** taught there |
| **Odantapuri** | Bihar | Founded by the Pala king Gopala |
| **Somapura Mahavihara** | Present-day Bangladesh | Built by Dharmapala; a UNESCO World Heritage Site |
| **Valabhi** | Gujarat | Under the Maitraka dynasty; Hinayana Buddhist learning and secular subjects |
| **Jagaddala** | Bengal | Founded by the Pala king Ramapala |
| **Kanchi (Kanchipuram)** | Tamil Nadu | A centre of Sanskrit, Buddhist and Jain learning |

Medieval India had **maktabs** (elementary) and **madrasas** (higher learning) alongside **pathshalas**, **tols** and **gurukuls**.

### The colonial period
| Year | Landmark | What it did |
|---|---|---|
| 1813 | Charter Act | First allocation of funds for education in India by the East India Company |
| 1835 | Macaulay's Minute | Favoured English-medium Western education ("downward filtration") |
| **1854** | **Wood's Despatch** | Called the "**Magna Carta of English education in India**"; proposed universities on the London model, grants-in-aid and departments of public instruction |
| **1857** | Universities of **Calcutta, Bombay and Madras** | The first modern universities, affiliating and examining bodies |
| 1882 | **Hunter Commission** (Indian Education Commission) | Focused on primary and secondary education |
| 1902 | **Raleigh Commission** (Indian Universities Commission) | Under Lord Curzon; led to the **Indian Universities Act, 1904** |
| 1917–19 | **Sadler Commission** (Calcutta University Commission) | Recommended a 12-year school stage before university, and an intermediate stage |
| 1929 | Hartog Committee | Quality over expansion |
| 1944 | **Sargent Plan** | A 40-year post-war plan for education |

### After independence
| Year | Landmark | Key point |
|---|---|---|
| **1948–49** | **University Education Commission** (chaired by **S. Radhakrishnan**) | The first commission of free India; recommended a **University Grants Commission** on the British model |
| 1952–53 | Secondary Education Commission (Mudaliar) | Diversified secondary education |
| **1953 / 1956** | **UGC** inaugurated (28 December 1953); statutory under the **UGC Act, 1956** | Coordinates, funds and maintains standards in universities |
| **1964–66** | **Education Commission** (chaired by **D. S. Kothari**) | "The destiny of India is now being shaped in her classrooms"; the **10 + 2 + 3** structure; spending 6% of national income on education |
| 1968 | First National Policy on Education | Based on Kothari |
| 1976 | **42nd Amendment** | Moved education from the State List to the **Concurrent List** |
| 1985 | **IGNOU** | National open university |
| **1986** | **National Policy on Education** (revised by the **Programme of Action, 1992**) | Access, equity, Operation Blackboard, open universities, autonomous colleges, NAAC |
| 2002 | **86th Amendment** | **Article 21A**: free and compulsory education for children aged 6 to 14 (Right to Education Act, 2009) |
| 2005–09 | National Knowledge Commission (Sam Pitroda) | Expansion, excellence, a single regulator |
| 2009 | Yash Pal Committee | Renovation and rejuvenation of higher education; proposed an overarching regulator |
| 2013 | **RUSA** (Rashtriya Uchchatar Shiksha Abhiyan) | Central funding for state universities |
| **2020** | **National Education Policy 2020** | See 3.4 |

### The Constitution and education
- **Entry 66, Union List:** coordination and determination of standards in higher education and research (the basis of UGC's powers).
- **Entry 25, Concurrent List:** education, including universities (after the 42nd Amendment, 1976).
- **Article 21A** (right to education, 6 to 14), **Article 45** (early childhood care up to 6), **Article 46** (educational interests of Scheduled Castes, Scheduled Tribes and weaker sections), **Article 29** and **Article 30** (minorities' cultural and educational rights), **Article 350A** (instruction in the mother tongue at the primary stage), **Article 51A(k)** (parents' duty to provide education).

:::widget sort
{"prompt": "Place each landmark in its period.", "buckets": ["Ancient", "Colonial (before 1947)", "After independence"], "items": [{"text": "Nalanda founded under Kumaragupta I", "bucket": 0}, {"text": "Wood's Despatch", "bucket": 1}, {"text": "Radhakrishnan Commission recommends a UGC", "bucket": 2}, {"text": "Indian Universities Act under Curzon", "bucket": 1}, {"text": "Kothari Commission proposes 10 + 2 + 3", "bucket": 2}, {"text": "Vikramashila founded by Dharmapala", "bucket": 0}, {"text": "Sadler Commission on Calcutta University", "bucket": 1}, {"text": "Education moved to the Concurrent List", "bucket": 2}]}
:::

:::recall
1. Which document is called the Magna Carta of English education in India, and when? || Wood's Despatch, 1854.
2. Name the first three modern universities and the year. || Calcutta, Bombay and Madras, 1857.
3. Who chaired the University Education Commission of 1948–49, and what did it recommend? || S. Radhakrishnan; a University Grants Commission.
4. When was the UGC inaugurated, and when did it become statutory? || 28 December 1953; UGC Act, 1956.
5. Which amendment moved education to the Concurrent List? || The 42nd Amendment, 1976.
6. Who founded Nalanda and Vikramashila? || Kumaragupta I (Gupta) and Dharmapala (Pala).
:::

:::mcq
Q: The Indian Universities Act of 1904 followed the recommendations of the:
- Hunter Commission
- Sadler Commission
- Sargent Plan
- *Raleigh Commission
> The Raleigh (Indian Universities) Commission of 1902.

Q: "The destiny of India is now being shaped in her classrooms" is from the report of the:
- Radhakrishnan Commission
- Mudaliar Commission
- *Kothari Commission
- Yash Pal Committee
> The Education Commission, 1964–66.

Q: The Chinese pilgrim who studied at Nalanda in the 7th century was:
- Fa-Hien
- Al-Biruni
- Megasthenes
- *Xuanzang (Hiuen Tsang)
> He studied there and wrote about it in detail.
:::

## 3.4 Higher education today: NEP 2020, regulators and governance [core][advanced]

### National Education Policy 2020
- Approved by the Union Cabinet on **29 July 2020**; drafted by a committee chaired by **Dr K. Kasturirangan**. It replaced the 1986 policy. The Ministry of Human Resource Development was renamed the **Ministry of Education**.
- **School:** a **5 + 3 + 3 + 4** structure (foundational, preparatory, middle, secondary) replacing 10 + 2; teaching in the **mother tongue or regional language at least up to Grade 5**, preferably Grade 8.
- **Higher education targets:** a **gross enrolment ratio of 50% by 2035** (AISHE 2021–22 reported about 28%).
- **Multidisciplinary education** in large institutions; colleges move toward autonomous degree-granting status, and the **affiliation system is to be phased out over 15 years**.
- **Four-year undergraduate programme** with **multiple entry and exit**: a certificate after 1 year, a diploma after 2, a bachelor's degree after 3, and a bachelor's with honours or research after 4.
- **Academic Bank of Credits**; **Multidisciplinary Education and Research Universities (MERUs)**.
- **M.Phil is discontinued.** (For clinical psychology, RCI has moved to a two-year M.A. in Clinical Psychology on a "4 + 2" model from 2025–26.)
- A single overarching regulator, the **Higher Education Commission of India (HECI)**, with **four verticals**: **NHERC** (regulation), **NAC** (accreditation), **HEGC** (grants) and **GEC** (General Education Council, for learning outcomes and standards). Medical and legal education are kept outside it.
- A **National Research Foundation** (now the **Anusandhan National Research Foundation**, set up under a 2023 Act).
- Public spending on education to reach **6% of GDP**; the **National Testing Agency** to run common entrance tests (CUET); the **National Educational Technology Forum (NETF)**; **Indian Knowledge Systems** in the curriculum; internationalisation.

:::note The regulator bill (status as of November 2026)
The **Viksit Bharat Shiksha Adhishthan Bill, 2025** was introduced in the Lok Sabha on **15 December 2025** to replace the UGC, AICTE and NCTE with one body and three councils (for regulation, accreditation and standards), as NEP 2020 proposed. It was referred to a **Joint Parliamentary Committee**, whose report had not been finalised as of November 2026. **The UGC, AICTE and NCTE continue to function.** Check the current status before your exam.
:::

### Regulators and other bodies
| Body | Set up | Role |
|---|---|---|
| **UGC** (University Grants Commission) | 1953 (statutory 1956) | Standards and grants for universities; conducts NET through NTA |
| **AICTE** | 1945 (statutory 1987) | Technical and management education |
| **NCTE** | Statutory from 1995 | Teacher education |
| **NMC** (National Medical Commission) | 2020, replacing the MCI | Medical education |
| **Bar Council of India** | Advocates Act, 1961 | Legal education and the legal profession |
| **RCI** (Rehabilitation Council of India) | RCI Act 1992 (statutory 1993) | Rehabilitation professionals, **including clinical psychologists**; maintains the Central Rehabilitation Register |
| **NAAC** (National Assessment and Accreditation Council) | 1994, Bengaluru (autonomous body under UGC) | Accredits institutions; moving from letter grades to **binary accreditation** (accredited or not) with **maturity-based levels** |
| **NBA** (National Board of Accreditation) | 1994; independent since 2010 | Accredits programmes, mainly technical |
| **NIRF** (National Institutional Ranking Framework) | Launched 2015; first rankings 2016 | Ranks institutions on teaching, learning and resources; research and professional practice; graduation outcomes; outreach and inclusivity; and perception |
| **NTA** (National Testing Agency) | 2017 | Conducts NET, CUET, NEET, JEE Main |
| **INFLIBNET** | 1991, Gandhinagar | Library network; Shodhganga; ONOS |
| **ICSSR** | 1969 | Social science research councils (also ICHR 1972, ICPR 1977) |
| **IGNOU** | 1985 | Open and distance learning |
| **NIOS** | 1989 | Open schooling |

### Types of institutions and governance
- **Central universities** (Act of Parliament), **state universities** (state Act), **state private universities**, **deemed-to-be universities** (declared by the Centre on UGC's advice, under Section 3 of the UGC Act), **Institutions of National Importance** (IITs, IIMs, AIIMS, NITs, by Act of Parliament) and **Institutions of Eminence** (a 2017 scheme).
- The **Visitor** of central universities is the **President of India**; the **Chancellor** of state universities is usually the **Governor**. The **Vice-Chancellor** is the chief executive and academic officer.
- Bodies inside a university: **Court or Senate** (supreme authority in many universities), **Executive Council or Syndicate** (executive), **Academic Council** (academic standards), **Boards of Studies**, the **Finance Committee**, and an **Internal Quality Assurance Cell (IQAC)**.
- **Value education** and **professional, technical and skill-based education** (the **National Council for Vocational Education and Training**, NCVET, 2018) are part of this unit.

:::widget decide
{"scene": "A Paper 1 question asks: 'Under NEP 2020, which is NOT one of the four verticals of the proposed Higher Education Commission of India?' The options are NHERC, NAC, HEGC and NAAC.", "ask": "Which do you choose?", "choices": [{"label": "NAC", "verdict": "harm", "outcome": "Wrong: the National Accreditation Council is one of the four verticals.", "why": "NAC is the proposed accreditation vertical."}, {"label": "NAAC", "verdict": "best", "outcome": "Correct. NAAC is the existing accreditation council; the NEP's proposed vertical is the NAC. The fourth vertical, missing from the options, is the General Education Council (GEC).", "why": "Exam setters use near-identical names: NAC (proposed) versus NAAC (existing)."}, {"label": "HEGC", "verdict": "harm", "outcome": "Wrong: the Higher Education Grants Council is the funding vertical.", "why": "NHERC, NAC, HEGC and GEC are the four verticals."}]}
:::

:::recall
1. When was NEP 2020 approved, and who chaired its drafting committee? || 29 July 2020; Dr K. Kasturirangan.
2. What GER target does NEP 2020 set for higher education? || 50% by 2035.
3. Name the four verticals of HECI. || NHERC (regulation), NAC (accreditation), HEGC (grants), GEC (standards).
4. What are the exit points in the four-year undergraduate programme? || Certificate after 1 year, diploma after 2, degree after 3, honours or research degree after 4.
5. Which body registers clinical psychologists in India? || The Rehabilitation Council of India.
6. What is the status of the VBSA Bill as of November 2026? || Introduced 15 December 2025 and referred to a Joint Parliamentary Committee; not passed; UGC, AICTE and NCTE continue.
:::

:::mcq
Q: Under NEP 2020, the school structure is:
- *5 + 3 + 3 + 4
- 10 + 2
- 8 + 4
- 6 + 3 + 3
> Foundational, preparatory, middle and secondary stages.

Q: NIRF was launched by the Ministry of Education in:
- 2010
- *2015
- 2018
- 2020
> First rankings published in 2016.

Q: The President of India is the Visitor of:
- All state universities
- *Central universities
- Private universities only
- Deemed universities only
> Governors usually head state universities as Chancellors.
:::

## 3.5 Paper 1 question styles: practice across units [core][advanced]
NTA uses the same few formats across units. Recognising the format saves time.

### The formats
- **Statement I and Statement II:** decide whether each is true. Judge each statement **alone** first.
- **Assertion (A) and Reason (R):** decide whether A is true, whether R is true, and whether R **correctly explains** A. Both can be true without R explaining A.
- **Match List I with List II:** start with the pair you are surest of; it usually removes two options at once.
- **Choose the correct ones ("A, B and D only"):** decide each statement as true or false, then find the matching option.
- **Arrange in order (chronology or sequence):** fix the first and last items first.

:::widget worked
{"title": "Working through the formats", "steps": [{"q": "Assertion (A): Kyoto Protocol imposed binding targets on all countries. Reason (R): The Paris Agreement requires every country to submit an NDC. How do you answer?", "a": "A is false: Kyoto bound only developed (Annex I) countries. R is true. So the answer is 'A is false, but R is true'."}, {"q": "Match: (a) Lasswell, (b) Berlo, (c) Dance, (d) Osgood and Schramm with (i) SMCR, (ii) helical, (iii) circular, (iv) 'who says what in which channel'. Which pair fixes it fastest?", "a": "Lasswell–(iv) and Berlo–(i) are the surest. Then Dance–(ii), Osgood and Schramm–(iii). Answer: a-iv, b-i, c-ii, d-iii."}, {"q": "Arrange in chronological order: (A) Kothari Commission, (B) Wood's Despatch, (C) NEP 2020, (D) Radhakrishnan Commission, (E) Sadler Commission.", "a": "Wood's 1854, Sadler 1917–19, Radhakrishnan 1948–49, Kothari 1964–66, NEP 2020: B, E, D, A, C."}, {"q": "Which are accepted as pramanas by Nyaya? (A) pratyaksha (B) anumana (C) arthapatti (D) upamana (E) shabda. Options: A, B and C only; A, B, D and E only; A and B only; all five.", "a": "Nyaya accepts four: perception, inference, comparison and testimony. Answer: A, B, D and E only."}]}
:::

:::recall
1. In an assertion–reason item, what extra judgement is needed when both are true? || Whether R correctly explains A.
2. What is the fastest way into a match-the-list item? || Fix the pair you are surest of first; it eliminates options.
:::

:::mcq
Q: Assertion (A): RAM is volatile memory. Reason (R): RAM is much faster than a hard disk. The correct answer is:
- Both A and R are true, and R is the correct explanation of A
- *Both A and R are true, but R is not the correct explanation of A
- A is true, but R is false
- A is false, but R is true
> Both statements are true, but speed does not explain volatility; RAM is volatile because it holds data only while powered.

Q: Arrange in order: (A) Montreal Protocol (B) Stockholm Conference (C) Paris Agreement (D) Rio Earth Summit.
- A, B, D, C
- B, D, A, C
- D, B, A, C
- *B, A, D, C
> 1972, 1987, 1992, 2015.
:::

# Part IV · Exam zone

## 4.1 Long answers, short notes and viva [core]
Paper 1 is objective, but writing short explanatory answers is the fastest way to fix these units in memory, and the same topics come up in **interviews for teaching posts**, **PhD entrance interviews** and **university education papers**.

### Long answer skeletons
**1. Discuss the levels of teaching and the factors that affect teaching.**
- Define teaching; bipolar and tripolar views.
- Memory (Herbart), understanding (Morrison), reflective (Hunt): aims, teacher and learner roles, steps, merits and limits.
- Factors: teacher, learner, support material, institution, environment.
- Link to Bloom's revised taxonomy and evaluation types.

**2. Explain the Nyaya theory of inference and its fallacies.**
- Pramana and prama; the six pramanas and which schools accept them.
- Terms: paksha, sadhya, hetu, vyapti, paksha-dharmata.
- Svartha and parartha; the five members with the hill example.
- Purvavat, sheshavat, samanyatodrishta.
- The five hetvabhasas with an example each; comparison with Western syllogism (middle term, undistributed middle).

**3. Discuss NEP 2020 with reference to higher education.**
- Background (1968, 1986 and 1992; Kasturirangan).
- Targets (50% GER by 2035), structure (four-year UG, multiple entry and exit, ABC), institutions (multidisciplinary, MERUs, end of affiliation), regulation (HECI and four verticals), research (ANRF), technology (NETF), languages and Indian Knowledge Systems, financing (6% of GDP).
- Implementation so far and open questions (state concerns, the VBSA Bill, funding).

**4. Describe the major international environmental agreements and India's climate commitments.**
- Stockholm 1972 to Paris 2015 (table), Kigali, Kunming-Montreal.
- India: NAPCC, updated NDC, net zero by 2070, ISA, the 50% non-fossil milestone, LiFE.
- Mental health links: heat, disasters, displacement, eco-anxiety.

### Short notes (5 marks each): outline points
- **Bloom's revised taxonomy:** six levels with verbs; knowledge dimension (factual, conceptual, procedural, metacognitive).
- **Microteaching:** origin, cycle (36 minutes), skills, merits.
- **SWAYAM:** four quadrants; credit transfer; NPTEL and other national coordinators.
- **Models of communication:** Lasswell, Shannon and Weaver, Berlo, Osgood and Schramm.
- **Barriers to communication:** six types with examples and remedies.
- **Square of opposition:** four relations with examples.
- **Hetvabhasa:** five fallacies with examples.
- **Plagiarism regulations (UGC, 2018):** levels and penalties.
- **Environment (Protection) Act, 1986:** background, umbrella character, powers.
- **Wood's Despatch:** recommendations and impact.
- **NAAC and NIRF:** accreditation versus ranking; NIRF parameters; the binary shift.

:::viva
Why does Paper 1 test logic and data alongside teaching? :: Because a lecturer or researcher must reason clearly, read evidence and explain it to learners; the paper tests the general thinking a teacher-researcher needs, whatever the subject.
How is anupalabdhi different from inference? :: Anupalabdhi knows an absence directly, by the non-perception of something that would be perceived if present; inference reasons from a mark to something not perceived. Bhatta Mimamsa and Advaita treat it as a separate pramana; Nyaya folds it into perception or inference.
What is the difference between NAAC and NIRF? :: NAAC accredits an institution's quality against standards (now moving to a binary decision with maturity levels); NIRF ranks institutions against one another on published parameters.
Why is Mehrabian's 7–38–55 rule often misused? :: It came from experiments on single words expressing feelings, where tone and face conflicted with the word. It does not show that most of all communication is non-verbal.
What would you do to make a large lecture class more reflective-level? :: Pose real problems, use think–pair–share, case discussions, short written reflections and questions that ask why and what if, and give formative feedback rather than only end-of-term marks.
:::

## 4.2 Module test [core]
Thirty questions across all ten units. Aim for 24 or more.

:::mcq
Q: In UGC NET, Paper 1 and Paper 2 together last:
- *3 hours with no break
- 2 hours with a break
- 3 hours, 1 hour for Paper 1
- 4 hours
> One sitting covers both papers.

Q: "Characterisation by a value" is the highest level of the:
- Cognitive domain
- Psychomotor domain
- Revised cognitive domain
- *Affective domain
> Krathwohl's affective taxonomy.

Q: The understanding level of teaching was advocated by:
- Herbart
- Hunt
- Bloom
- *Morrison
> Morrison's understanding level.

Q: The Keller Plan is also known as:
- Linear programmed instruction
- The Dalton Plan
- *Personalised System of Instruction
- The project method of Kilpatrick
> Mastery-based, self-paced learning.

Q: An evaluation that compares a learner's score with the scores of other learners is:
- Criterion-referenced
- Formative
- *Norm-referenced
- Diagnostic
> Relative standing.

Q: Research that generates new theory, without an immediate application, is:
- Action research
- *Fundamental research
- Applied research
- Evaluation research
> Basic or pure research.

Q: Under UGC's 2018 regulations, a thesis with 55% similarity falls in:
- Level 0
- *Level 2
- Level 1
- Level 3
> Above 40 and up to 60%.

Q: In citations, the Latin phrase et alii (always shortened) means:
- In the same place
- In the work cited
- Compare
- *And others
> It is used when a work has several authors.

Q: In a comprehension passage, a question asking for the author's attitude is a question about:
- Vocabulary
- *Tone
- Detail
- Title
> Tone or attitude.

Q: SMCR is the model of:
- Shannon
- Lasswell
- *Berlo
- Dance
> Source, message, channel, receiver.

Q: The study of touch in communication is:
- Kinesics
- Proxemics
- Chronemics
- *Haptics
> From the Greek for touch.

Q: The theory that media influence flows through opinion leaders is:
- *Two-step flow
- Agenda setting
- Cultivation
- Uses and gratifications
> Lazarsfeld and Katz.

Q: If 12 men can build a wall in 10 days, how many days will 8 men take?
- *15
- 12
- 8
- 20
> Work = 120 man-days; 120 ÷ 8 = 15.

Q: The compound interest on ₹2,000 at 10% a year for 2 years is:
- ₹400
- ₹440
- *₹420
- ₹200
> 2,000 × 1.21 = 2,420.

Q: The next term in 5, 10, 20, 40, ? is:
- 60
- 50
- 100
- *80
> Each term doubles.

Q: "No doctors are careless" is an:
- A proposition
- *E proposition
- I proposition
- O proposition
> Universal negative.

Q: Two propositions that cannot both be true but can both be false are:
- Contradictories
- Subcontraries
- *Contraries
- Subalterns
> A and E.

Q: Which school accepts three pramanas?
- *Samkhya
- Charvaka
- Nyaya
- Advaita Vedanta
> Perception, inference and testimony.

Q: In "the hill has fire because it has smoke", the paksha is:
- Fire
- *The hill
- Smoke
- The kitchen
> The subject of the inference.

Q: A reason that is present both where the sadhya is and where it is absent is:
- Viruddha
- Badhita
- *Savyabhichara
- Asiddha
> Irregular, inconclusive reason.

Q: A sector of 108° in a pie chart is what percentage?
- *30%
- 25%
- 33%
- 36%
> 108 ÷ 360 = 0.30.

Q: The share of BA in total enrolment rose from 30% to 36%. This is a rise of:
- 6%
- 36%
- *6 percentage points, or 20%
- 20 percentage points
> 6 points; 6 ÷ 30 = 20% relative.

Q: Which memory is volatile?
- ROM
- Hard disk
- *RAM
- Pen drive
> RAM loses its contents without power.

Q: IMAP is used for:
- *Receiving mail and keeping it synchronised on the server
- Sending mail to an outside server
- Transferring web pages to a browser
- Turning domain names into IP addresses
> POP3 downloads; IMAP synchronises.

Q: The Environment (Protection) Act was passed in:
- 1974
- *1986
- 1981
- 2002
> After the Bhopal gas disaster.

Q: The Montreal Protocol deals with:
- Greenhouse gases from industry
- *Ozone-depleting substances
- Movement of hazardous waste
- Wetlands of international importance
> Kigali later added HFCs.

Q: COP31 (November 2026) is being held in:
- *Antalya
- Belém
- Baku
- Dubai
> Türkiye hosts; Australia presides over negotiations.

Q: Nalanda was founded under the Gupta ruler:
- *Kumaragupta I
- Chandragupta Maurya
- Harsha
- Dharmapala
> 5th century CE.

Q: NEP 2020 aims for a GER in higher education of:
- 35% by 2030
- 60% by 2040
- *50% by 2035
- 100% by 2030
> The headline higher-education target.

Q: Which body registers clinical psychologists in India?
- UGC
- NMC
- *RCI
- NCTE
> The Rehabilitation Council of India.
:::
`;
