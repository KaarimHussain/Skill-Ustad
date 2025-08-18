export const roadmapTemplates: Record<string, any> = {
    /* ------------------------------------------------------------------
     * 1. WEB DEVELOPMENT  (20 nodes)
     * ------------------------------------------------------------------ */
    "web development": {
        nodes: [
            { id: "wd-1", type: "start", position: { x: 100, y: 50 }, data: { label: "Kick-off", description: "Set up VS Code, Git, GitHub and browser dev-tools." } },
            { id: "wd-2", type: "topic", position: { x: 100, y: 200 }, data: { label: "HTML5 Deep-dive", description: "Semantic tags, accessibility, forms, media, SEO basics." } },
            { id: "wd-3", type: "quiz", position: { x: 300, y: 200 }, data: { label: "HTML Quiz", description: "10 interactive questions to validate your HTML knowledge." } },
            { id: "wd-4", type: "topic", position: { x: 100, y: 350 }, data: { label: "CSS3 & Modern Layout", description: "Flexbox, Grid, custom properties, animations, media queries." } },
            { id: "wd-5", type: "project", position: { x: 300, y: 350 }, data: { label: "Responsive Portfolio Page", description: "Deploy a mobile-first portfolio to GitHub Pages." } },
            { id: "wd-6", type: "concept", position: { x: 500, y: 350 }, data: { label: "DOM & Web APIs", description: "Document, window, fetch, localStorage, geolocation." } },
            { id: "wd-7", type: "topic", position: { x: 500, y: 200 }, data: { label: "JavaScript ES6+", description: "Arrow functions, destructuring, modules, async/await." } },
            { id: "wd-8", type: "step", position: { x: 700, y: 200 }, data: { label: "Tooling", description: "Webpack, Vite, linters, formatters, Babel transpilation." } },
            { id: "wd-9", type: "course", position: { x: 900, y: 200 }, data: { label: "React Fundamentals", description: "Components, JSX, props, state, hooks, context." } },
            { id: "wd-10", type: "project", position: { x: 900, y: 350 }, data: { label: "Interactive React App", description: "Build a task board with drag-and-drop functionality." } },
            { id: "wd-11", type: "topic", position: { x: 700, y: 500 }, data: { label: "Node.js & Express", description: "REST APIs, middleware, authentication, error handling." } },
            { id: "wd-12", type: "concept", position: { x: 500, y: 500 }, data: { label: "Relational Databases", description: "PostgreSQL basics, joins, indexing, normalization." } },
            { id: "wd-13", type: "topic", position: { x: 300, y: 500 }, data: { label: "NoSQL & Redis", description: "MongoDB CRUD, aggregation, caching strategies." } },
            { id: "wd-14", type: "project", position: { x: 100, y: 650 }, data: { label: "Full-Stack MERN App", description: "User auth, file uploads, real-time chat, Dockerized." } },
            { id: "wd-15", type: "milestone", position: { x: 300, y: 650 }, data: { label: "CI/CD & Testing", description: "GitHub Actions, Jest + React-Testing-Library, Cypress." } },
            { id: "wd-16", type: "topic", position: { x: 500, y: 650 }, data: { label: "Next.js & SSR", description: "Routing, data fetching, ISR, image optimization." } },
            { id: "wd-17", type: "topic", position: { x: 700, y: 650 }, data: { label: "Security Best Practices", description: "OWASP Top 10, rate-limiting, helmet, JWT refresh tokens." } },
            { id: "wd-18", type: "quiz", position: { x: 900, y: 500 }, data: { label: "Security Quiz", description: "Scenario-based questions on web vulnerabilities." } },
            { id: "wd-19", type: "project", position: { x: 900, y: 650 }, data: { label: "Deploy to Production", description: "Use Vercel/Netlify + Render/Heroku with HTTPS, monitoring." } },
            { id: "wd-20", type: "end", position: { x: 1100, y: 650 }, data: { label: "Ship It!", description: "Publish your portfolio & open-source the code." } },
        ],
        edges: [
            ["wd-1", "wd-2"], ["wd-2", "wd-3"], ["wd-3", "wd-4"], ["wd-4", "wd-5"],
            ["wd-5", "wd-7"], ["wd-7", "wd-6"], ["wd-7", "wd-8"], ["wd-8", "wd-9"],
            ["wd-9", "wd-10"], ["wd-10", "wd-11"], ["wd-11", "wd-12"], ["wd-12", "wd-13"],
            ["wd-11", "wd-14"], ["wd-14", "wd-15"], ["wd-15", "wd-16"], ["wd-16", "wd-17"],
            ["wd-17", "wd-18"], ["wd-18", "wd-19"], ["wd-19", "wd-20"]
        ].map(([s, t], i) => ({ id: `e-wd-${i}`, source: s, target: t })),
    },

    /* ------------------------------------------------------------------
     * 2. DATA SCIENCE  (19 nodes)
     * ------------------------------------------------------------------ */
    "data science": {
        nodes: [
            { id: "ds-1", type: "start", position: { x: 100, y: 50 }, data: { label: "Environment Setup", description: "Install Anaconda, VS Code, Jupyter & configure Git." } },
            { id: "ds-2", type: "course", position: { x: 100, y: 200 }, data: { label: "Python for DS", description: "NumPy, pandas, list comprehensions, virtual envs." } },
            { id: "ds-3", type: "quiz", position: { x: 300, y: 200 }, data: { label: "Python Quiz", description: "Quick check on data structures & vectorization." } },
            { id: "ds-4", type: "topic", position: { x: 500, y: 200 }, data: { label: "SQL Mastery", description: "Window functions, CTEs, query optimization." } },
            { id: "ds-5", type: "concept", position: { x: 100, y: 350 }, data: { label: "Statistics Refresher", description: "Descriptive, inferential stats, Bayes theorem." } },
            { id: "ds-6", type: "topic", position: { x: 300, y: 350 }, data: { label: "Data Cleaning", description: "Missing values, outliers, encoding, feature scaling." } },
            { id: "ds-7", type: "project", position: { x: 500, y: 350 }, data: { label: "EDA on NYC 311", description: "End-to-end exploratory analysis & storytelling." } },
            { id: "ds-8", type: "topic", position: { x: 700, y: 350 }, data: { label: "Data Visualization", description: "Matplotlib, Seaborn, Plotly dashboards." } },
            { id: "ds-9", type: "milestone", position: { x: 900, y: 350 }, data: { label: "Storytelling with Data", description: "Create a slide deck for non-tech stakeholders." } },
            { id: "ds-10", type: "course", position: { x: 700, y: 200 }, data: { label: "Scikit-learn", description: "Regression, classification, clustering, pipelines." } },
            { id: "ds-11", type: "project", position: { x: 900, y: 200 }, data: { label: "Kaggle Titanic", description: "Feature engineering & model stacking." } },
            { id: "ds-12", type: "concept", position: { x: 100, y: 500 }, data: { label: "Model Evaluation", description: "Cross-validation, ROC-AUC, confusion matrix." } },
            { id: "ds-13", type: "topic", position: { x: 300, y: 500 }, data: { label: "Hyper-parameter Tuning", description: "Grid search, randomized search, Bayesian optimization." } },
            { id: "ds-14", type: "course", position: { x: 500, y: 500 }, data: { label: "Deep Learning", description: "Keras & PyTorch basics, CNNs, RNNs, transfer learning." } },
            { id: "ds-15", type: "project", position: { x: 700, y: 500 }, data: { label: "Image Classifier", description: "Fine-tune ResNet50 on CIFAR-10 with GPU." } },
            { id: "ds-16", type: "topic", position: { x: 900, y: 500 }, data: { label: "MLOps", description: "MLflow, model registry, CI/CD for models." } },
            { id: "ds-17", type: "step", position: { x: 300, y: 650 }, data: { label: "Deploy Model", description: "REST API with FastAPI + Docker on Heroku." } },
            { id: "ds-18", type: "quiz", position: { x: 500, y: 650 }, data: { label: "Capstone Quiz", description: "Scenario questions on bias-variance & ethics." } },
            { id: "ds-19", type: "end", position: { x: 700, y: 650 }, data: { label: "Portfolio Complete", description: "Push projects to GitHub & write Medium articles." } },
        ],
        edges: [
            ["ds-1", "ds-2"], ["ds-2", "ds-3"], ["ds-3", "ds-4"], ["ds-2", "ds-5"],
            ["ds-5", "ds-6"], ["ds-6", "ds-7"], ["ds-7", "ds-8"], ["ds-8", "ds-9"],
            ["ds-2", "ds-10"], ["ds-10", "ds-11"], ["ds-11", "ds-12"], ["ds-12", "ds-13"],
            ["ds-13", "ds-14"], ["ds-14", "ds-15"], ["ds-15", "ds-16"], ["ds-16", "ds-17"],
            ["ds-17", "ds-18"], ["ds-18", "ds-19"]
        ].map(([s, t], i) => ({ id: `e-ds-${i}`, source: s, target: t })),
    },

    /* ------------------------------------------------------------------
     * 3. CYBERSECURITY  (18 nodes)
     * ------------------------------------------------------------------ */
    "cybersecurity": {
        nodes: [
            { id: "cy-1", type: "start", position: { x: 100, y: 50 }, data: { label: "Lab Setup", description: "VirtualBox, Kali Linux, DVWA, Metasploitable." } },
            { id: "cy-2", type: "course", position: { x: 100, y: 200 }, data: { label: "Networking Basics", description: "TCP/IP, subnetting, Wireshark packet analysis." } },
            { id: "cy-3", type: "quiz", position: { x: 300, y: 200 }, data: { label: "Networking Quiz", description: "Identify protocols & port numbers." } },
            { id: "cy-4", type: "concept", position: { x: 500, y: 200 }, data: { label: "CIA Triad", description: "Confidentiality, Integrity, Availability examples." } },
            { id: "cy-5", type: "topic", position: { x: 100, y: 350 }, data: { label: "Linux & Bash", description: "Permissions, grep, awk, cron, systemd." } },
            { id: "cy-6", type: "project", position: { x: 300, y: 350 }, data: { label: "Secure a Server", description: "Harden Ubuntu: SSH keys, UFW, fail2ban, auditd." } },
            { id: "cy-7", type: "topic", position: { x: 500, y: 350 }, data: { label: "Blue Team Ops", description: "SIEM, intrusion detection, log analysis, SOAR." } },
            { id: "cy-8", type: "milestone", position: { x: 700, y: 350 }, data: { label: "SOC Analyst L1", description: "Earn Blue Team Level 1 certification." } },
            { id: "cy-9", type: "topic", position: { x: 900, y: 350 }, data: { label: "Red Team Ops", description: "Reconnaissance, exploitation, post-exploitation, pivoting." } },
            { id: "cy-10", type: "course", position: { x: 700, y: 200 }, data: { label: "Penetration Testing", description: "OWASP Testing Guide, Nmap, Burp Suite, Metasploit." } },
            { id: "cy-11", type: "project", position: { x: 900, y: 200 }, data: { label: "CTF Competitions", description: "Solve 50 PicoCTF & HackTheBox machines." } },
            { id: "cy-12", type: "concept", position: { x: 100, y: 500 }, data: { label: "Cryptography", description: "Symmetric vs asymmetric, hashing, digital signatures." } },
            { id: "cy-13", type: "topic", position: { x: 300, y: 500 }, data: { label: "Cloud Security", description: "AWS IAM, SCPs, GuardDuty, KMS, S3 bucket hardening." } },
            { id: "cy-14", type: "project", position: { x: 500, y: 500 }, data: { label: "IAM Assessment", description: "Audit misconfigured roles in a sandbox AWS account." } },
            { id: "cy-15", type: "topic", position: { x: 700, y: 500 }, data: { label: "Malware Analysis", description: "Static & dynamic analysis, Cuckoo sandbox, YARA rules." } },
            { id: "cy-16", type: "quiz", position: { x: 500, y: 650 }, data: { label: "GRC Quiz", description: "Risk assessment, NIST CSF, ISO 27001 controls." } },
            { id: "cy-17", type: "step", position: { x: 700, y: 650 }, data: { label: "Certifications", description: "Plan for Security+ → CySA+ → OSCP pathway." } },
            { id: "cy-18", type: "end", position: { x: 900, y: 650 }, data: { label: "Red vs Blue Exercise", description: "Run a full-day purple-team simulation." } },
        ],
        edges: [
            ["cy-1", "cy-2"], ["cy-2", "cy-3"], ["cy-3", "cy-4"], ["cy-2", "cy-5"],
            ["cy-5", "cy-6"], ["cy-6", "cy-7"], ["cy-7", "cy-8"], ["cy-4", "cy-9"],
            ["cy-9", "cy-10"], ["cy-10", "cy-11"], ["cy-4", "cy-12"], ["cy-12", "cy-13"],
            ["cy-13", "cy-14"], ["cy-9", "cy-15"], ["cy-15", "cy-16"], ["cy-16", "cy-17"],
            ["cy-17", "cy-18"]
        ].map(([s, t], i) => ({ id: `e-cy-${i}`, source: s, target: t })),
    },

    /* ------------------------------------------------------------------
     * 4. CLOUD COMPUTING  (17 nodes)
     * ------------------------------------------------------------------ */
    "cloud computing": {
        nodes: [
            { id: "cl-1", type: "start", position: { x: 100, y: 50 }, data: { label: "Set Up Cloud Lab", description: "Create free-tier accounts in AWS, Azure & GCP." } },
            { id: "cl-2", type: "course", position: { x: 100, y: 200 }, data: { label: "IT Foundations", description: "OSI model, DNS, HTTP, load-balancing basics." } },
            { id: "cl-3", type: "quiz", position: { x: 300, y: 200 }, data: { label: "Networking Quiz", description: "Subnets, routes, security groups." } },
            { id: "cl-4", type: "topic", position: { x: 500, y: 200 }, data: { label: "Linux CLI", description: "Bash scripting, cron, systemd, logrotate." } },
            { id: "cl-5", type: "concept", position: { x: 700, y: 200 }, data: { label: "Cloud Well-Architected", description: "AWS 5 pillars, Azure CAF, GCP SRE." } },
            { id: "cl-6", type: "topic", position: { x: 100, y: 350 }, data: { label: "Core AWS Services", description: "EC2, S3, RDS, VPC, IAM, CloudWatch." } },
            { id: "cl-7", type: "project", position: { x: 300, y: 350 }, data: { label: "Deploy a Static Site", description: "S3 + CloudFront + Route 53 + ACM (HTTPS)." } },
            { id: "cl-8", type: "topic", position: { x: 500, y: 350 }, data: { label: "IaC with Terraform", description: "Providers, modules, state management, remote back-ends." } },
            { id: "cl-9", type: "milestone", position: { x: 700, y: 350 }, data: { label: "Terraform Associate", description: "Schedule & pass HashiCorp certification." } },
            { id: "cl-10", type: "topic", position: { x: 900, y: 350 }, data: { label: "Docker Essentials", description: "Images, containers, volumes, networks, Docker Compose." } },
            { id: "cl-11", type: "project", position: { x: 900, y: 200 }, data: { label: "Containerize App", description: "Multi-stage Dockerfile for Node.js API." } },
            { id: "cl-12", type: "course", position: { x: 100, y: 500 }, data: { label: "Kubernetes", description: "Pods, services, deployments, ingress, Helm charts." } },
            { id: "cl-13", type: "project", position: { x: 300, y: 500 }, data: { label: "EKS Cluster", description: "Provision managed K8s with eksctl & deploy app." } },
            { id: "cl-14", type: "topic", position: { x: 500, y: 500 }, data: { label: "CI/CD with GitHub Actions", description: "Build, test, push to ECR, deploy to EKS." } },
            { id: "cl-15", type: "concept", position: { x: 700, y: 500 }, data: { label: "Monitoring & Logging", description: "Prometheus, Grafana, CloudWatch, ELK stack." } },
            { id: "cl-16", type: "quiz", position: { x: 900, y: 500 }, data: { label: "Multi-cloud Quiz", description: "Compare services across AWS, Azure, GCP." } },
            { id: "cl-17", type: "end", position: { x: 500, y: 650 }, data: { label: "Solutions Architect", description: "Book AWS SAA-C03 exam & build capstone project." } },
        ],
        edges: [
            ["cl-1", "cl-2"], ["cl-2", "cl-3"], ["cl-3", "cl-4"], ["cl-4", "cl-5"],
            ["cl-5", "cl-6"], ["cl-6", "cl-7"], ["cl-7", "cl-8"], ["cl-8", "cl-9"],
            ["cl-9", "cl-10"], ["cl-10", "cl-11"], ["cl-11", "cl-12"], ["cl-12", "cl-13"],
            ["cl-13", "cl-14"], ["cl-14", "cl-15"], ["cl-15", "cl-16"], ["cl-16", "cl-17"]
        ].map(([s, t], i) => ({ id: `e-cl-${i}`, source: s, target: t })),
    },

    /* ------------------------------------------------------------------
     * 5. MOBILE DEVELOPMENT  (16 nodes)
     * ------------------------------------------------------------------ */
    "mobile development": {
        nodes: [
            { id: "mb-1", type: "start", position: { x: 100, y: 50 }, data: { label: "Dev Environment", description: "Install Android Studio, Xcode or Flutter SDK." } },
            { id: "mb-2", type: "topic", position: { x: 100, y: 200 }, data: { label: "Dart Language", description: "Null-safety, async, streams, OOP patterns." } },
            { id: "mb-3", type: "quiz", position: { x: 300, y: 200 }, data: { label: "Dart Quiz", description: "Async/await pitfalls & widget lifecycle." } },
            { id: "mb-4", type: "course", position: { x: 500, y: 200 }, data: { label: "Flutter Widgets", description: "Material, Cupertino, stateless vs stateful." } },
            { id: "mb-5", type: "concept", position: { x: 700, y: 200 }, data: { label: "Responsive Design", description: "LayoutBuilder, MediaQuery, adaptive layouts." } },
            { id: "mb-6", type: "project", position: { x: 900, y: 200 }, data: { label: "Tip Calculator App", description: "Deploy to Play Store Internal Testing." } },
            { id: "mb-7", type: "topic", position: { x: 100, y: 350 }, data: { label: "State Management", description: "Provider, Riverpod, Bloc patterns." } },
            { id: "mb-8", type: "topic", position: { x: 300, y: 350 }, data: { label: "RESTful APIs", description: "HTTP package, json_serializable, error handling." } },
            { id: "mb-9", type: "project", position: { x: 500, y: 350 }, data: { label: "Weather App", description: "Consume OpenWeatherMap API with geolocation." } },
            { id: "mb-10", type: "milestone", position: { x: 700, y: 350 }, data: { label: "Unit & Widget Tests", description: "Achieve 80 % coverage with flutter_test." } },
            { id: "mb-11", type: "topic", position: { x: 900, y: 350 }, data: { label: "Firebase Integration", description: "Auth, Firestore, Cloud Messaging, Crashlytics." } },
            { id: "mb-12", type: "topic", position: { x: 100, y: 500 }, data: { label: "Local Storage", description: "SharedPreferences, Hive, SQLite, secure storage." } },
            { id: "mb-13", type: "project", position: { x: 300, y: 500 }, data: { label: "Chat App", description: "Real-time Firestore chat with push notifications." } },
            { id: "mb-14", type: "concept", position: { x: 500, y: 500 }, data: { label: "CI/CD for Mobile", description: "GitHub Actions → Fastlane → TestFlight & Play Console." } },
            { id: "mb-15", type: "quiz", position: { x: 700, y: 500 }, data: { label: "Performance Quiz", description: "Reduce APK size, frame drops, memory leaks." } },
            { id: "mb-16", type: "end", position: { x: 900, y: 500 }, data: { label: "Store Release", description: "Create store listings & gather analytics." } },
        ],
        edges: [
            ["mb-1", "mb-2"], ["mb-2", "mb-3"], ["mb-3", "mb-4"], ["mb-4", "mb-5"],
            ["mb-5", "mb-6"], ["mb-6", "mb-7"], ["mb-7", "mb-8"], ["mb-8", "mb-9"],
            ["mb-9", "mb-10"], ["mb-10", "mb-11"], ["mb-11", "mb-12"], ["mb-12", "mb-13"],
            ["mb-13", "mb-14"], ["mb-14", "mb-15"], ["mb-15", "mb-16"]
        ].map(([s, t], i) => ({ id: `e-mb-${i}`, source: s, target: t })),
    },

    /* ------------------------------------------------------------------
     * 6. DEVOPS & SRE  (19 nodes)
     * ------------------------------------------------------------------ */
    "devops": {
        nodes: [
            { id: "dv-1", type: "start", position: { x: 100, y: 50 }, data: { label: "Prereqs", description: "Linux, Git, networking, Bash scripting." } },
            { id: "dv-2", type: "course", position: { x: 100, y: 200 }, data: { label: "Version Control Deep-dive", description: "Rebase, hooks, semantic releases, GitFlow." } },
            { id: "dv-3", type: "project", position: { x: 300, y: 200 }, data: { label: "Mono-repo Setup", description: "Nx + pnpm workspaces with shared CI." } },
            { id: "dv-4", type: "topic", position: { x: 500, y: 200 }, data: { label: "Docker Mastery", description: "Multi-stage builds, distroless, buildx bake." } },
            { id: "dv-5", type: "quiz", position: { x: 700, y: 200 }, data: { label: "Docker Quiz", description: "Optimize image size & security scanning." } },
            { id: "dv-6", type: "course", position: { x: 100, y: 350 }, data: { label: "Kubernetes", description: "CKA curriculum: cluster architecture, RBAC, networking." } },
            { id: "dv-7", type: "milestone", position: { x: 300, y: 350 }, data: { label: "Certified K8s Admin", description: "Book & pass CKA exam." } },
            { id: "dv-8", type: "topic", position: { x: 500, y: 350 }, data: { label: "Helm & Operators", description: "Package management, CRDs, Helmfile." } },
            { id: "dv-9", type: "project", position: { x: 700, y: 350 }, data: { label: "Argo CD GitOps", description: "Declarative deployments with sync policies." } },
            { id: "dv-10", type: "concept", position: { x: 900, y: 350 }, data: { label: "Observability", description: "Prometheus, Grafana, Alertmanager, SLOs." } },
            { id: "dv-11", type: "project", position: { x: 900, y: 200 }, data: { label: "Monitoring Stack", description: "Kube-Prometheus-stack with custom dashboards." } },
            { id: "dv-12", type: "topic", position: { x: 100, y: 500 }, data: { label: "Terraform Cloud", description: "Remote state, workspaces, policy as code." } },
            { id: "dv-13", type: "step", position: { x: 300, y: 500 }, data: { label: "CI/CD Templates", description: "Reusable GitHub Actions workflows." } },
            { id: "dv-14", type: "project", position: { x: 500, y: 500 }, data: { label: "Blue-Green Deploy", description: "Automated rollback with Argo Rollouts." } },
            { id: "dv-15", type: "topic", position: { x: 700, y: 500 }, data: { label: "Chaos Engineering", description: "Litmus, Chaos Mesh, game days." } },
            { id: "dv-16", type: "quiz", position: { x: 500, y: 650 }, data: { label: "SRE Quiz", description: "Error budgets, toil reduction, blameless post-mortems." } },
            { id: "dv-17", type: "milestone", position: { x: 700, y: 650 }, data: { label: "SLO Achievement", description: "Maintain 99.9 % availability for 30 days." } },
            { id: "dv-18", type: "end", position: { x: 900, y: 650 }, data: { label: "DevOps Portfolio", description: "Document everything in GitHub & blog series." } },
        ],
        edges: [
            ["dv-1", "dv-2"], ["dv-2", "dv-3"], ["dv-3", "dv-4"], ["dv-4", "dv-5"],
            ["dv-5", "dv-6"], ["dv-6", "dv-7"], ["dv-7", "dv-8"], ["dv-8", "dv-9"],
            ["dv-9", "dv-10"], ["dv-10", "dv-11"], ["dv-4", "dv-12"], ["dv-12", "dv-13"],
            ["dv-13", "dv-14"], ["dv-14", "dv-15"], ["dv-15", "dv-16"], ["dv-16", "dv-17"],
            ["dv-17", "dv-18"]
        ].map(([s, t], i) => ({ id: `e-dv-${i}`, source: s, target: t })),
    },

    /* ------------------------------------------------------------------
     * 7. BLOCKCHAIN  (15 nodes)
     * ------------------------------------------------------------------ */
    "blockchain": {
        nodes: [
            { id: "bc-1", type: "start", position: { x: 100, y: 50 }, data: { label: "Crypto Primer", description: "Hash functions, digital signatures, Merkle trees." } },
            { id: "bc-2", type: "concept", position: { x: 100, y: 200 }, data: { label: "Consensus Algorithms", description: "PoW, PoS, BFT, DAGs." } },
            { id: "bc-3", type: "quiz", position: { x: 300, y: 200 }, data: { label: "Consensus Quiz", description: "Compare energy usage & finality." } },
            { id: "bc-4", type: "course", position: { x: 500, y: 200 }, data: { label: "Ethereum Basics", description: "Accounts, transactions, gas, EVM opcodes." } },
            { id: "bc-5", type: "topic", position: { x: 700, y: 200 }, data: { label: "Solidity", description: "Contracts, inheritance, modifiers, events, patterns." } },
            { id: "bc-6", type: "project", position: { x: 900, y: 200 }, data: { label: "ERC-20 Token", description: "Deploy & verify on Goerli with Hardhat." } },
            { id: "bc-7", type: "milestone", position: { x: 900, y: 350 }, data: { label: "Testnet Faucet Mastery", description: "Interact with faucets & explorers." } },
            { id: "bc-8", type: "topic", position: { x: 700, y: 350 }, data: { label: "Web3.js & Ethers.js", description: "Frontend integration, MetaMask, events." } },
            { id: "bc-9", type: "project", position: { x: 500, y: 350 }, data: { label: "NFT Marketplace", description: "Mint, list, buy NFTs with React + Hardhat." } },
            { id: "bc-10", type: "concept", position: { x: 300, y: 350 }, data: { label: "DeFi Primitives", description: "DEX, AMM, liquidity pools, yield farming." } },
            { id: "bc-11", type: "topic", position: { x: 100, y: 500 }, data: { label: "Smart-contract Security", description: "Re-entrancy, overflow, audits, fuzzing." } },
            { id: "bc-12", type: "quiz", position: { x: 300, y: 500 }, data: { label: "Security Quiz", description: "Spot vulnerabilities in sample contracts." } },
            { id: "bc-13", type: "project", position: { x: 500, y: 500 }, data: { label: "DAO Voting", description: "Governance token & timelock contracts." } },
            { id: "bc-14", type: "step", position: { x: 700, y: 500 }, data: { label: "Layer-2 Scaling", description: "Deploy to Polygon, compare gas fees." } },
            { id: "bc-15", type: "end", position: { x: 900, y: 500 }, data: { label: "Main-net DApp", description: "Launch audited dApp with frontend on IPFS." } },
        ],
        edges: [
            ["bc-1", "bc-2"], ["bc-2", "bc-3"], ["bc-3", "bc-4"], ["bc-4", "bc-5"],
            ["bc-5", "bc-6"], ["bc-6", "bc-7"], ["bc-7", "bc-8"], ["bc-8", "bc-9"],
            ["bc-9", "bc-10"], ["bc-10", "bc-11"], ["bc-11", "bc-12"], ["bc-12", "bc-13"],
            ["bc-13", "bc-14"], ["bc-14", "bc-15"]
        ].map(([s, t], i) => ({ id: `e-bc-${i}`, source: s, target: t })),
    },

    /* ------------------------------------------------------------------
     * 8. MACHINE LEARNING OPS (MLOps)  (17 nodes)
     * ------------------------------------------------------------------ */
    "mlops": {
        nodes: [
            { id: "mo-1", type: "start", position: { x: 100, y: 50 }, data: { label: "Environment", description: "Conda, Docker, VS Code dev-containers." } },
            { id: "mo-2", type: "course", position: { x: 100, y: 200 }, data: { label: "Python DS Stack", description: "Pandas, NumPy, Scikit-learn, PyTorch." } },
            { id: "mo-3", type: "project", position: { x: 300, y: 200 }, data: { label: "Training Pipeline", description: "MLflow tracking server & artifact store." } },
            { id: "mo-4", type: "concept", position: { x: 500, y: 200 }, data: { label: "Feature Store", description: "Feast, online vs offline features." } },
            { id: "mo-5", type: "topic", position: { x: 700, y: 200 }, data: { label: "Model Registry", description: "MLflow models, versioning, stage transitions." } },
            { id: "mo-6", type: "quiz", position: { x: 900, y: 200 }, data: { label: "Registry Quiz", description: "Promote model from staging to production." } },
            { id: "mo-7", type: "topic", position: { x: 100, y: 350 }, data: { label: "Containerize Model", description: "Build minimal Docker image with FastAPI." } },
            { id: "mo-8", type: "project", position: { x: 300, y: 350 }, data: { label: "Kubernetes Serving", description: "Deploy model behind KServe autoscaler." } },
            { id: "mo-9", type: "milestone", position: { x: 500, y: 350 }, data: { label: "Canary Release", description: "Split traffic 90/10 with Argo Rollouts." } },
            { id: "mo-10", type: "concept", position: { x: 700, y: 350 }, data: { label: "Data & Model Drift", description: "EvidentlyAI, statistical tests, retraining triggers." } },
            { id: "mo-11", type: "topic", position: { x: 900, y: 350 }, data: { label: "CI/CD for ML", description: "GitHub Actions + DVC for data & model pipelines." } },
            { id: "mo-12", type: "project", position: { x: 100, y: 500 }, data: { label: "End-to-End Flow", description: "Train, validate, deploy & monitor in one PR." } },
            { id: "mo-13", type: "step", position: { x: 300, y: 500 }, data: { label: "Edge Deployment", description: "ONNX Runtime on NVIDIA Jetson." } },
            { id: "mo-14", type: "quiz", position: { x: 500, y: 500 }, data: { label: "MLOps Quiz", description: "SLOs for ML services, rollback strategies." } },
            { id: "mo-15", type: "topic", position: { x: 700, y: 500 }, data: { label: "Cost Optimization", description: "Spot instances, autoscaling, model quantization." } },
            { id: "mo-16", type: "milestone", position: { x: 900, y: 500 }, data: { label: "Certification", description: "Clear Google MLOps or AWS MLS-C01." } },
            { id: "mo-17", type: "end", position: { x: 500, y: 650 }, data: { label: "Production Success", description: "Monitor model for 30 days with 99 % uptime." } },
        ],
        edges: [
            ["mo-1", "mo-2"], ["mo-2", "mo-3"], ["mo-3", "mo-4"], ["mo-4", "mo-5"],
            ["mo-5", "mo-6"], ["mo-6", "mo-7"], ["mo-7", "mo-8"], ["mo-8", "mo-9"],
            ["mo-9", "mo-10"], ["mo-10", "mo-11"], ["mo-11", "mo-12"], ["mo-12", "mo-13"],
            ["mo-13", "mo-14"], ["mo-14", "mo-15"], ["mo-15", "mo-16"], ["mo-16", "mo-17"]
        ].map(([s, t], i) => ({ id: `e-mo-${i}`, source: s, target: t })),
    },

    /* ------------------------------------------------------------------
     * 9. PRODUCT MANAGEMENT  (16 nodes)
     * ------------------------------------------------------------------ */
    "product management": {
        nodes: [
            { id: "pm-1", type: "start", position: { x: 100, y: 50 }, data: { label: "PM Foundations", description: "Roles, responsibilities, cross-functional teams." } },
            { id: "pm-2", type: "course", position: { x: 100, y: 200 }, data: { label: "User Research", description: "Interviews, surveys, JTBD, personas." } },
            { id: "pm-3", type: "project", position: { x: 300, y: 200 }, data: { label: "Problem Statement", description: "Craft hypothesis and opportunity canvas." } },
            { id: "pm-4", type: "concept", position: { x: 500, y: 200 }, data: { label: "Product Strategy", description: "Vision, mission, OKRs, competitive analysis." } },
            { id: "pm-5", type: "topic", position: { x: 700, y: 200 }, data: { label: "Road-mapping", description: "Now-Next-Later, RICE, MoSCoW prioritization." } },
            { id: "pm-6", type: "quiz", position: { x: 900, y: 200 }, data: { label: "Prioritization Quiz", description: "Choose features under constraints." } },
            { id: "pm-7", type: "topic", position: { x: 100, y: 350 }, data: { label: "Agile & Scrum", description: "User stories, estimation, sprint ceremonies." } },
            { id: "pm-8", type: "project", position: { x: 300, y: 350 }, data: { label: "Sprint Planning", description: "Run planning poker & create sprint backlog." } },
            { id: "pm-9", type: "milestone", position: { x: 500, y: 350 }, data: { label: "MVP Launch", description: "Deliver & demo first working increment." } },
            { id: "pm-10", type: "topic", position: { x: 700, y: 350 }, data: { label: "Metrics & Analytics", description: "AARRR, funnel analysis, cohort retention." } },
            { id: "pm-11", type: "project", position: { x: 900, y: 350 }, data: { label: "A/B Test Plan", description: "Design experiment & calculate sample size." } },
            { id: "pm-12", type: "concept", position: { x: 100, y: 500 }, data: { label: "Stakeholder Management", description: "RACI, communication plans, escalation paths." } },
            { id: "pm-13", type: "step", position: { x: 300, y: 500 }, data: { label: "Go-to-Market", description: "Pricing, positioning, launch checklist." } },
            { id: "pm-14", type: "quiz", position: { x: 500, y: 500 }, data: { label: "Ethics Quiz", description: "Data privacy, dark patterns, accessibility." } },
            { id: "pm-15", type: "topic", position: { x: 700, y: 500 }, data: { label: "Career Growth", description: "PM levels, mentorship, networking." } },
            { id: "pm-16", type: "end", position: { x: 900, y: 500 }, data: { label: "Product Leader", description: "Prepare for APM → PM → Senior PM pathway." } },
        ],
        edges: [
            ["pm-1", "pm-2"], ["pm-2", "pm-3"], ["pm-3", "pm-4"], ["pm-4", "pm-5"],
            ["pm-5", "pm-6"], ["pm-6", "pm-7"], ["pm-7", "pm-8"], ["pm-8", "pm-9"],
            ["pm-9", "pm-10"], ["pm-10", "pm-11"], ["pm-11", "pm-12"], ["pm-12", "pm-13"],
            ["pm-13", "pm-14"], ["pm-14", "pm-15"], ["pm-15", "pm-16"]
        ].map(([s, t], i) => ({ id: `e-pm-${i}`, source: s, target: t })),
    },

    /* ------------------------------------------------------------------
     * 10. UI/UX DESIGN  (15 nodes)
     * ------------------------------------------------------------------ */
    "ui ux design": {
        nodes: [
            { id: "ux-1", type: "start", position: { x: 100, y: 50 }, data: { label: "Design Tools", description: "Figma, FigJam, Adobe CC, Zeplin." } },
            { id: "ux-2", type: "course", position: { x: 100, y: 200 }, data: { label: "Design Thinking", description: "Empathize, define, ideate, prototype, test." } },
            { id: "ux-3", type: "project", position: { x: 300, y: 200 }, data: { label: "User Journey Map", description: "Create for an e-commerce checkout flow." } },
            { id: "ux-4", type: "concept", position: { x: 500, y: 200 }, data: { label: "Information Architecture", description: "Card sorting, sitemaps, navigation patterns." } },
            { id: "ux-5", type: "topic", position: { x: 700, y: 200 }, data: { label: "Wireframing", description: "Low-fidelity vs high-fidelity, responsive grids." } },
            { id: "ux-6", type: "quiz", position: { x: 900, y: 200 }, data: { label: "Heuristic Evaluation", description: "Apply Nielsen’s 10 heuristics." } },
            { id: "ux-7", type: "topic", position: { x: 100, y: 350 }, data: { label: "Visual Design", description: "Color theory, typography, spacing, hierarchy." } },
            { id: "ux-8", type: "project", position: { x: 300, y: 350 }, data: { label: "Design System", description: "Atomic components, tokens, Storybook integration." } },
            { id: "ux-9", type: "milestone", position: { x: 500, y: 350 }, data: { label: "Usability Testing", description: "Moderated remote tests with 5 users." } },
            { id: "ux-10", type: "topic", position: { x: 700, y: 350 }, data: { label: "Accessibility", description: "WCAG 2.1, screen readers, keyboard nav." } },
            { id: "ux-11", type: "project", position: { x: 900, y: 350 }, data: { label: "Mobile App Redesign", description: "Case study & Dribbble shots." } },
            { id: "ux-12", type: "concept", position: { x: 100, y: 500 }, data: { label: "Interaction Design", description: "Micro-animations, haptics, gestures." } },
            { id: "ux-13", type: "step", position: { x: 300, y: 500 }, data: { label: "Portfolio Website", description: "Notion + Framer or Webflow build." } },
            { id: "ux-14", type: "quiz", position: { x: 500, y: 500 }, data: { label: "Portfolio Review", description: "Peer feedback & iterate." } },
            { id: "ux-15", type: "end", position: { x: 700, y: 500 }, data: { label: "Design Lead", description: "Apply to mid-level product design roles." } },
        ],
        edges: [
            ["ux-1", "ux-2"], ["ux-2", "ux-3"], ["ux-3", "ux-4"], ["ux-4", "ux-5"],
            ["ux-5", "ux-6"], ["ux-6", "ux-7"], ["ux-7", "ux-8"], ["ux-8", "ux-9"],
            ["ux-9", "ux-10"], ["ux-10", "ux-11"], ["ux-11", "ux-12"], ["ux-12", "ux-13"],
            ["ux-13", "ux-14"], ["ux-14", "ux-15"]
        ].map(([s, t], i) => ({ id: `e-ux-${i}`, source: s, target: t })),
    },
};