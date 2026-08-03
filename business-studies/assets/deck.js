/* ============================================================
   Class XII Business Studies (CBSE 054) — Presentation Deck engine
   Right arrow  : reveal next item, else next slide
   Left arrow   : step back
   m            : slide menu       f : fullscreen
   Home / End   : first / last slide

   Derived from ../../microeconomics/assets/deck.js. The engine is
   identical; the GLOSSARY below is this subject's own and is much
   larger, because Business Studies carries a heavier terminology
   load than any other course in this repository and its terms
   arrive in near-identical pairs.
   ============================================================ */
(function () {
  var slides = [], idx = 0, step = 0;

  /* ============================================================
     GLOSSARY — recall panels for jargon
     A student meeting "accountability" six chapters after it was
     defined does not remember how it differs from "responsibility".
     So every slide that USES a technical term it does not itself
     define carries a small badge next to that term:

         Decentralisation<button class="info" data-term="delegation"></button>

     deck.js builds the panel from this table, wires the ARIA
     attributes and appends it to the END of the slide — so a
     chapter file never repeats a definition and the definitions
     can never drift apart between chapters.

     Each entry has:
       term  the panel heading
       def   the EXAM-READY definition — the sentence a student
             should reproduce in the paper, with the words the
             examiner is hunting for in <b>…</b>
       q     optional: the term it is routinely confused with, and
             the distinction. Rendered as the quiet .q block.

     Rules for editing:
       · Add new terms HERE, never in a chapter file.
       · Keys are lower-case kebab slugs, unique across the course.
       · Only <b> <i> <sub> <sup> <br> are allowed in the text.
       · Plain ASCII apostrophes only — these are JS strings.
       · An unknown data-term REMOVES its button rather than showing
         a dead one, so a typo fails silently. `node tools/check.js`
         is what catches it.
     ============================================================ */
  var GLOSSARY = {

    /* ---- Units 1-4  ·  Nature of Management · Principles · Business Environment · Planning ---- */
    'management': {
      term: "Management",
      def: "Management is the <b>process</b> of getting things done with the aim of achieving <b>goals effectively and efficiently</b>. Process means the primary functions performed by managers - <b>planning, organising, staffing, directing and controlling</b>. Effective means completing the right task; efficient means completing it at minimum cost.",
      q: "Do not write management as merely 'getting work done'. The mark lies in the three words process, effectively and efficiently, and in naming the five functions."
    },
    'effectiveness': {
      term: "Effectiveness",
      def: "Effectiveness means <b>doing the right task</b> - completing the activity and <b>achieving the end result or goal</b> within the given time, whatever the cost incurred.",
      q: "Not the same as efficiency: effectiveness is concerned with the <b>end result</b>, efficiency with the <b>cost of the resources used</b>. Management needs both - a manager who achieves the target by wasting resources is effective but not efficient."
    },
    'efficiency': {
      term: "Efficiency",
      def: "Efficiency means <b>doing the task correctly and at minimum cost</b> - obtaining the <b>maximum output from the minimum input</b>. It is a cost-benefit relationship.",
      q: "Not the same as effectiveness: efficiency measures the <b>input-output ratio</b>, effectiveness measures whether the <b>goal was reached</b>. High efficiency with a missed target is of no use to the organisation."
    },
    'organisational-objectives': {
      term: "Organisational objectives",
      def: "The economic objectives that management must achieve for the enterprise itself. The three main ones are <b>survival</b> (earning enough revenue to cover costs), <b>profit</b> (to cover risk and stay in business) and <b>growth</b> (measured by sales, number of employees, products or capital investment).",
      q: "One of three sets of objectives - do not confuse with social objectives (what management owes society) or personal objectives (what employees want)."
    },
    'social-objectives': {
      term: "Social objectives",
      def: "The objectives that require management to <b>create benefit for society</b> - using <b>environment-friendly methods</b> of production, giving <b>employment opportunities to the disadvantaged sections</b> of society, and providing <b>basic amenities</b> such as schools, creches and health care for employees.",
      q: "Social objectives are owed to <b>society at large</b>; personal objectives are owed to the <b>employees</b>. A creche for employees' children is usually credited as a social objective in the marking scheme."
    },
    'personal-objectives': {
      term: "Personal objectives",
      def: "The individual objectives of the <b>employees</b> of the organisation, which management must reconcile with organisational objectives - <b>competitive salaries and perks</b>, <b>peer recognition</b>, and <b>personal growth and development</b>.",
      q: "Personal objectives belong to the <b>people inside</b> the firm; social objectives belong to <b>society outside</b> it."
    },
    'management-as-art': {
      term: "Management as an art",
      def: "Art has three features - a <b>systematised body of knowledge</b>, <b>personalised application</b>, and its being <b>based on practice and creativity</b>. Management fulfils all three, since a manager applies a common body of management knowledge in his own individual style and improves it with practice. Hence <b>management is an art</b>.",
      q: "Management is <b>both</b> a science and an art - never write that it is only one. Science supplies the knowledge, art supplies its personalised application."
    },
    'management-as-science': {
      term: "Management as a science",
      def: "Science has three features - a <b>systematised body of knowledge</b>, <b>principles based on experimentation</b>, and <b>universal validity</b>. Management has an organised body of knowledge and its principles have been evolved over time by observation, but because it deals with <b>human behaviour</b> its principles cannot be applied identically in every situation. Hence <b>management is an inexact or behavioural science</b>, not a pure science like physics.",
      q: "The examiner wants the qualifier: management is a science but <b>not an exact science</b>. Saying flatly 'management is a science' loses the mark."
    },
    'management-as-profession': {
      term: "Management as a profession",
      def: "A profession has five features - a <b>well-defined body of knowledge</b>, <b>restricted entry</b> through a qualifying examination, a <b>professional association</b>, an <b>ethical code of conduct</b> and a <b>service motive</b>. Management has a body of knowledge, an association (AIMA) with a code of conduct and a service motive, but <b>entry is not restricted</b> and the code is <b>not statutorily enforceable</b>. Hence <b>management does not fully qualify as a profession</b>.",
      q: "The answer is a qualified 'no'. Anyone may be called a manager without a degree, unlike a doctor or a chartered accountant - that is the deciding point."
    },
    'top-level-management': {
      term: "Top level management",
      def: "Consists of the <b>Chairman, Chief Executive Officer, Board of Directors, Managing Director, President and Vice-Presidents</b>. It is responsible for the <b>welfare and survival</b> of the organisation, <b>formulates overall organisational goals and strategies</b>, analyses the business environment, and <b>coordinates the activities of different departments</b>. It is answerable to the shareholders for the performance of the enterprise.",
      q: "Top level <b>formulates</b> policy; middle level <b>interprets</b> it; supervisory level <b>executes</b> it. Fitting a case to the wrong level is the commonest error."
    },
    'middle-level-management': {
      term: "Middle level management",
      def: "Consists of <b>divisional heads, plant superintendents and operations managers</b>. It is the <b>link between top and lower level management</b>. It <b>interprets the policies</b> framed by top management, ensures its department has the necessary personnel, <b>assigns duties and responsibilities</b> to the lower level, motivates them to achieve the objectives, and cooperates with other departments.",
      q: "The keyword the examiner looks for is <b>link</b> - middle level connects top and operational management."
    },
    'supervisory-management': {
      term: "Supervisory (operational) management",
      def: "Consists of <b>foremen and supervisors</b>, the lowest level of the hierarchy. It <b>directly oversees the efforts of the workforce</b>, ensures the <b>quality of output</b>, minimises <b>wastage of materials</b>, maintains <b>safety standards</b>, and passes the <b>workers' grievances</b> upward to higher management.",
      q: "Also called lower level or first-line management. The foreman is described as the <b>lowest ranking manager and the highest ranking worker</b> - he executes plans, he does not make them."
    },
    'functions-of-management': {
      term: "Functions of management",
      def: "The five functions performed by every manager, in sequence: <b>Planning</b> (deciding in advance what to do), <b>Organising</b> (assigning duties and establishing authority relationships), <b>Staffing</b> (putting the right person in the right job), <b>Directing</b> (instructing, guiding, motivating and leading), and <b>Controlling</b> (measuring actual performance against the standard and taking corrective action).",
      q: "Directing and controlling are routinely swapped. Directing acts on <b>people while work is going on</b>; controlling acts on <b>results after work is done</b> and feeds back into planning."
    },
    'coordination': {
      term: "Coordination",
      def: "Coordination is the process by which a manager <b>synchronises and integrates the activities of different departments</b> so that there is <b>unity of action</b> in the pursuit of common objectives. Because it is required in every function and at every level, coordination is called the <b>essence of management</b>, not a separate function of it.",
      q: "Not the same as cooperation: coordination is a <b>deliberate managerial function</b>; cooperation is the <b>voluntary willingness</b> of people to help one another. Cooperation without coordination wastes effort."
    },
    'cooperation': {
      term: "Cooperation",
      def: "Cooperation is the <b>voluntary and willing effort</b> of individuals to help one another at work. It arises from the attitudes of people, is <b>informal</b> in nature, and cannot be ordered by a manager.",
      q: "Not the same as coordination: cooperation is <b>voluntary and informal</b>, coordination is a <b>deliberate, orderly and formal</b> synchronising of efforts. Both are needed - coordination without cooperation is difficult, cooperation without coordination is fruitless."
    },
    'principle-of-management': {
      term: "Principle of management",
      def: "Principles of management are <b>broad and general guidelines</b> to the decision-making and behaviour of managers. They are derived by <b>observation and analysis of events</b> which managers face in actual practice, and they establish a <b>cause and effect relationship</b> so that a manager can predict the consequence of an action.",
      q: "A principle is <b>not a technique</b>: a principle is a guideline to <b>thinking and behaviour</b>, whereas a technique is a <b>procedure or method</b> to be carried out. It is also <b>not a principle of pure science</b>: management principles are <b>flexible and contingent</b> because they deal with human beings, whereas the principles of pure science are rigid and give exact results."
    },
    'management-technique': {
      term: "Technique of management",
      def: "Techniques of management are the <b>procedures or methods</b>, involving a <b>series of steps</b>, that are actually carried out to accomplish a desired goal - for example Taylor's <b>functional foremanship, method study and time study</b>.",
      q: "A technique tells you <b>how the work is to be done</b>; a principle tells you <b>what to keep in mind while deciding</b>. Listing a technique under the word 'principle' in an answer loses the mark outright."
    },
    'significance-of-principles': {
      term: "Significance of management principles",
      def: "Management principles are significant because they provide managers with <b>useful insights into reality</b>, lead to the <b>optimum utilisation of resources and effective administration</b>, enable <b>scientific decisions</b>, help in <b>meeting changing environment requirements</b>, help in <b>fulfilling social responsibility</b>, and are the basis of <b>management training, education and research</b>.",
      q: "Six points, so a 6-mark question. Keep each as a bolded heading with one explanatory line - a paragraph without headings loses most of the marks."
    },
    'division-of-work': {
      term: "Division of work (Fayol)",
      def: "Work should be <b>divided into small tasks</b> and each task assigned to the person best suited to it, so that the same person performs the same job repeatedly, gains <b>specialisation</b>, and produces greater <b>efficiency and accuracy of output</b>. Fayol held it applies to <b>all kinds of work, technical as well as managerial</b>.",
      q: "This is <b>Fayol's</b> principle. Taylor's <b>functional foremanship</b> is the shop-floor <b>technique</b> that extends it - do not name one when the case calls for the other."
    },
    'authority-and-responsibility': {
      term: "Authority and responsibility (Fayol)",
      def: "<b>Authority</b> is the right to give orders and obtain obedience; <b>responsibility</b> is the obligation to complete the task assigned, and is the corollary of authority. There must be a <b>balance between the two</b> - authority without responsibility leads to <b>misuse of power</b>, and responsibility without authority makes a manager <b>ineffective</b>.",
      q: "Distinct from <b>accountability</b> (Chapter 5), which is being <b>answerable</b> for the final outcome and can never be delegated. Fayol's principle is only about keeping authority and responsibility <b>in balance</b>."
    },
    'discipline': {
      term: "Discipline (Fayol)",
      def: "Discipline is <b>obedience to organisational rules and to the employment agreement</b>, which are necessary for the working of the organisation. Fayol held that discipline requires <b>good superiors at all levels</b>, <b>clear and fair agreements</b>, and the <b>judicious application of penalties</b>.",
      q: "Discipline is about <b>honouring commitments on both sides</b> - management and workers. Do not reduce it to punishing employees, and do not confuse it with the principle of <b>Order</b>, which is about placement of people and materials."
    },
    'unity-of-command': {
      term: "Unity of command (Fayol)",
      def: "There should be <b>one and only one boss for every individual employee</b> - each subordinate should receive orders from, and be responsible to, <b>only one superior</b>. Fayol held that if this principle is violated, <b>authority is undermined, discipline is in jeopardy, order disturbed and stability threatened</b>. It prevents <b>dual subordination</b>.",
      q: "Not the same as unity of direction: unity of command is <b>one employee, one boss</b> and affects an <b>individual</b>; unity of direction is <b>one group, one head, one plan</b> and affects the <b>whole organisation</b>. Note also that Taylor's functional foremanship deliberately breaks this principle."
    },
    'unity-of-direction': {
      term: "Unity of direction (Fayol)",
      def: "Each group of activities having the <b>same objective</b> must have <b>one head and one plan</b>. This ensures <b>unity of action and coordination</b> and prevents the <b>overlapping of activities</b> - for example a firm making both motorcycles and cars should have two separate divisions, each with its own incharge and its own plan.",
      q: "Not the same as unity of command. Aim: unity of command prevents <b>dual subordination</b>, unity of direction prevents <b>overlapping of activities</b>."
    },
    'subordination-of-individual-interest': {
      term: "Subordination of individual interest to general interest (Fayol)",
      def: "The <b>interest of the organisation must take priority</b> over the interest of any one individual employee. A manager must <b>reconcile</b> the two, and must set an example by not misusing his authority for personal or family benefit at the cost of the larger interest of the company.",
      q: "This is <b>Fayol's</b> principle of putting the group first. Do not confuse it with Taylor's <b>Cooperation, not Individualism</b>, which is about management and workers ending their class conflict and working together."
    },
    'remuneration-of-employees': {
      term: "Remuneration of employees (Fayol)",
      def: "Employees should be paid <b>fair and equitable wages</b> that give them at least a <b>reasonable standard of living</b> and that are at the same time <b>within the paying capacity of the company</b>. Fair remuneration ensures a congenial atmosphere and good relations between workers and management.",
      q: "This is <b>Fayol's</b> principle about the <b>fairness</b> of pay. Taylor's <b>differential piece wage system</b> is a <b>technique</b> about the <b>method</b> of paying, which rewards efficient workers with a higher rate."
    },
    'centralisation-and-decentralisation-fayol': {
      term: "Centralisation and decentralisation (Fayol)",
      def: "<b>Centralisation</b> is the concentration of decision-making authority in a few hands at the top; <b>decentralisation</b> is its <b>dispersal among more than one person</b>. Fayol held there must be a <b>proper balance</b> between the two, the degree depending on the circumstances - in general, large organisations need <b>more decentralisation</b> than small ones.",
      q: "Fayol treats the two as a <b>matter of degree</b> - every organisation has both, and the principle is only about balancing them. In Chapter 5, <b>decentralisation</b> is taught more narrowly as the <b>systematic delegation of authority throughout all levels</b> of the organisation, and it is never absolute."
    },
    'scalar-chain': {
      term: "Scalar chain (Fayol)",
      def: "The <b>formal lines of authority and communication running from the highest to the lowest rank</b> are called the scalar chain, and it <b>should be followed in the normal course</b> of formal communication. In an emergency, two employees at the <b>same level</b> may communicate directly through a short cut called the <b>gang plank</b>.",
      q: "This is <b>Fayol's</b> principle. Do not confuse the scalar chain (the <b>path</b> communication must follow) with the principle of <b>Order</b> (people and materials in their proper <b>place</b>)."
    },
    'gang-plank': {
      term: "Gang plank",
      def: "A gang plank is a <b>shorter route across the scalar chain</b> that permits two employees at the <b>same level</b> of the hierarchy to communicate <b>directly in an emergency</b>, so that communication is not delayed. Their respective superiors must be <b>kept informed</b>.",
      q: "The gang plank does <b>not violate</b> the scalar chain - it is a permitted exception within it. It can only be used <b>between employees of the same rank</b>, never between a superior and a subordinate on different levels."
    },
    'order': {
      term: "Order (Fayol)",
      def: "According to Fayol, <b>people and materials must be in suitable places at the appropriate time</b> for maximum efficiency. The principle is stated as <b>a place for everything (everyone) and everything (everyone) in its place</b>, which removes hindrances to activity and raises productivity.",
      q: "Order is about <b>orderly placement</b>; <b>Discipline</b> is about <b>obedience to rules and agreements</b>. A case about tools lying scattered on the shop floor is Order, not Discipline."
    },
    'equity': {
      term: "Equity (Fayol)",
      def: "Managers should show <b>kindliness and justice</b> in their behaviour towards workers, so that there is <b>no discrimination</b> on grounds of gender, religion, language, caste, belief or nationality. Equity secures the <b>loyalty and devotion</b> of employees.",
      q: "Equity means <b>fair</b> treatment, not identical treatment - Fayol allowed that lazy personnel be dealt with <b>sternly</b>, precisely to show that everyone is equal in the eyes of management. Also unrelated to <b>equity share capital</b> in Chapters 9 and 10."
    },
    'stability-of-personnel': {
      term: "Stability of personnel (Fayol)",
      def: "<b>Employee turnover should be minimised</b> to maintain organisational efficiency. Personnel should be selected and appointed after a <b>due and rigorous procedure</b>, and once selected should be kept in their post for a <b>minimum fixed tenure</b> and given reasonable time to show results.",
      q: "The keyword is <b>minimum tenure</b> or <b>stability of tenure</b>. Do not answer this with Chapter 6 staffing content - Fayol's point is about <b>retention</b>, not about how to recruit."
    },
    'initiative': {
      term: "Initiative (Fayol)",
      def: "Initiative means <b>taking the first step with self-motivation</b> - thinking out and executing a plan. Workers should be <b>encouraged to develop and carry out their plans for improvement</b>, and a good company should have an <b>employee suggestion system</b> in which suggestions that cut cost or time are rewarded.",
      q: "Initiative does <b>not</b> mean going against the established practices of the company for the sake of being different. Also distinguish from Taylor's <b>Cooperation, not Individualism</b>, where welcoming suggestions is only one element of a wider principle of ending management-worker conflict."
    },
    'esprit-de-corps': {
      term: "Esprit de corps (Fayol)",
      def: "Management should promote a <b>spirit of team unity and harmony among employees</b>. A manager should <b>replace 'I' with 'We'</b> in all his conversations with workers, so as to build <b>mutual trust and a sense of belongingness</b>, which minimises the need for penalties.",
      q: "The exact phrase <b>esprit de corps</b> is the mark - write it, spelled correctly. It is <b>team spirit among employees (horizontal)</b>; Taylor's <b>Harmony, not Discord</b> is peace between <b>management and workers (vertical)</b>."
    },
    'scientific-management': {
      term: "Scientific management (Taylor)",
      def: "Scientific management means <b>applying the methods of science</b> - observation, measurement, experiment and analysis - <b>to the problems of management</b>, so as to find the <b>one best way</b> of doing every job. <b>F. W. Taylor</b>, known as the <b>Father of Scientific Management</b>, developed it at the Midvale and Bethlehem Steel companies and set out <b>four principles</b> and a set of <b>techniques</b>.",
      q: "Taylor's <b>four principles</b> and his <b>eight techniques</b> are two separate lists and are examined separately. Taylor worked upward from the <b>shop floor</b>; Fayol worked downward from <b>top management</b>."
    },
    'science-not-rule-of-thumb': {
      term: "Science, not rule of thumb (Taylor)",
      def: "Taylor held that there is <b>only one best method</b> of doing every job, which should be developed through <b>study and analysis</b>, and that this scientifically developed <b>standard method must replace the rule of thumb</b> followed by different managers throughout the organisation.",
      q: "This is a <b>principle</b>, not a technique. The techniques through which it is put into practice are <b>method study, motion study, time study and standardisation</b> - never list those under this heading."
    },
    'harmony-not-discord': {
      term: "Harmony, not discord (Taylor)",
      def: "There should be <b>complete harmony between management and workers</b> instead of class conflict, since a conflict between the two helps neither. Taylor called for a <b>complete mental revolution</b> on the part of both - management should <b>share the gains</b> of the company with workers, and workers should work hard and <b>accept change</b> for the good of the company.",
      q: "This is a <b>principle</b>, not a technique. It is harmony <b>between management and workers</b>; Fayol's <b>esprit de corps</b> is team spirit <b>among employees</b>."
    },
    'cooperation-not-individualism': {
      term: "Cooperation, not individualism (Taylor)",
      def: "There should be <b>complete cooperation between labour and management</b> instead of individualism, and <b>competition should be replaced by cooperation</b>. Management must welcome and <b>reward employees' suggestions</b> and take workers into confidence before important decisions; workers must desist from strikes and unreasonable demands. Taylor asked for an <b>almost equal division of work and responsibility</b> between workers and management.",
      q: "This is a <b>principle</b>, not a technique, and it is an <b>extension of Harmony, not Discord</b>. Do not confuse it with Fayol's <b>Subordination of individual interest to general interest</b>, which is about the group outranking one person."
    },
    'development-of-each-person': {
      term: "Development of each and every person to his or her greatest efficiency and prosperity (Taylor)",
      def: "Each worker should be <b>scientifically selected</b>, given work that suits his <b>physical, mental and intellectual capabilities</b>, and given the <b>required training</b> in the best method, so that every person develops to his <b>greatest efficiency</b>. Efficient workers produce more and earn more, bringing <b>prosperity to both the worker and the company</b>.",
      q: "This is a <b>principle</b>, not a technique. The <b>differential piece wage system</b> is the technique that rewards the efficiency this principle builds."
    },
    'mental-revolution': {
      term: "Mental revolution",
      def: "Mental revolution means a <b>complete change in the attitude of both management and workers</b> towards one another - from confrontation to cooperation. Management should <b>share the gains</b> of the company with workers and workers should work hard and accept change; Taylor held that <b>the true interests of the two are one and the same</b>, and that prosperity for the employer cannot last unless accompanied by prosperity for the employees.",
      q: "Mental revolution is the attitude change Taylor demanded under the principles of <b>Harmony, not Discord</b> and <b>Cooperation, not Individualism</b>. It is a <b>concept</b>, not one of the eight techniques."
    },
    'functional-foremanship': {
      term: "Functional foremanship",
      def: "Functional foremanship is Taylor's technique of <b>separating planning from execution</b> and placing each worker under <b>eight specialist foremen</b>. Under the <b>Planning incharge</b>: <b>instruction card clerk, route clerk, time and cost clerk and disciplinarian</b>. Under the <b>Production incharge</b>: <b>speed boss, gang boss, repair boss and inspector</b>. It extends division of work and specialisation to the shop floor.",
      q: "This is a <b>technique</b> of scientific management, not a principle. It deliberately <b>violates Fayol's unity of command</b>, since one worker takes orders from eight foremen - say so if the question asks you to compare Taylor and Fayol."
    },
    'standardisation-of-work': {
      term: "Standardisation of work",
      def: "Standardisation is the process of <b>setting standards or benchmarks for every business activity</b> - of process, raw material, time, product, machinery, methods or working conditions - which must then be <b>adhered to during production</b>. Its objects are to fix types and sizes, establish <b>interchangeability of parts</b>, and set standards of quality and of performance for men and machines.",
      q: "A <b>technique</b>, not a principle. Standardisation means <b>devising a new standard variety</b>; <b>simplification</b> means <b>eliminating superfluous existing varieties</b> - they pull in opposite directions and are examined together."
    },
    'simplification-of-work': {
      term: "Simplification of work",
      def: "Simplification aims at <b>eliminating superfluous varieties, sizes and dimensions</b> of a product - that is, unnecessary diversity. It results in <b>reduced inventories</b>, <b>fuller utilisation of equipment</b>, savings in the cost of labour, machines and tools, and <b>increased turnover</b>.",
      q: "A <b>technique</b>, not a principle. Simplification <b>cuts down</b> the existing product range; standardisation <b>sets a new benchmark</b> for it."
    },
    'method-study': {
      term: "Method study",
      def: "Method study is the technique of finding out the <b>one best way of doing a job</b>, covering every activity from the <b>procurement of raw material until the final product is delivered</b> to the customer, so as to <b>minimise the cost of production and maximise customer satisfaction</b>. Taylor devised the concept of the <b>assembly line</b> using method study.",
      q: "A <b>technique</b>, not a principle. Method study finds the <b>best way</b>; motion study removes <b>unnecessary movements</b>; time study fixes the <b>standard time</b>. These three are the most frequently swapped items in the paper."
    },
    'motion-study': {
      term: "Motion study",
      def: "Motion study is the study of the <b>movements</b> - such as lifting, putting objects, sitting and changing position - which are undertaken while doing a job, so that <b>unnecessary movements are eliminated</b> and the job is completed in less time. Taylor and Frank Gilbreth reduced the motions in brick laying <b>from 18 to 5</b>.",
      q: "A <b>technique</b>, not a principle. Motion study deals with <b>body movements</b>; time study deals with the <b>time</b> a job should take. Quote the 18-to-5 brick laying figure - it is the standard illustration."
    },
    'time-study': {
      term: "Time study",
      def: "Time study determines the <b>standard time taken to perform a well-defined job</b>, by taking several readings with a <b>time-measuring device</b> for each element of the task. Its objectives are to <b>determine the number of workers to be employed</b>, to <b>frame suitable incentive schemes</b>, and to <b>determine labour costs</b>.",
      q: "A <b>technique</b>, not a principle. Time study fixes <b>how long</b>; motion study fixes <b>which movements</b>; fatigue study fixes <b>how much rest</b>."
    },
    'fatigue-study': {
      term: "Fatigue study",
      def: "Fatigue study seeks to determine the <b>amount and frequency of rest intervals</b> required for completing a task. A worker who does not rest cannot work at the same capacity, so proper rest intervals help him <b>regain stamina</b> and thereby <b>increase productivity</b>.",
      q: "A <b>technique</b>, not a principle. Fatigue study is about <b>rest intervals</b>; time study is about the <b>working time</b> itself. The two are often fused in answers."
    },
    'differential-piece-wage': {
      term: "Differential piece wage system",
      def: "Under this system a <b>standard output is fixed by work study</b> and <b>two different rates of wage</b> are paid - a <b>higher rate per unit</b> to workers who produce at or above the standard, and a <b>lower rate</b> to those who produce below it. The wide gap in earnings <b>rewards efficient workers</b> and <b>motivates inefficient workers</b> to improve.",
      q: "A <b>technique</b> of scientific management, not a principle - it is the technique that carries out the principle of <b>Development of each person to his greatest efficiency and prosperity</b>. It also reappears in Chapter 7 as a <b>financial incentive</b>."
    },
    'business-environment': {
      term: "Business environment",
      def: "Business environment means the <b>sum total of all individuals, institutions and other forces that are outside a business enterprise but that potentially affect its performance</b>. It includes economic, social, political, technological and legal forces as well as customers, competitors, suppliers, investors, government, courts and the media.",
      q: "The definition must contain both halves - <b>outside the business</b> and <b>affecting its performance</b>. Forces inside the firm (its employees, its capital) are not part of the business environment."
    },
    'features-of-business-environment': {
      term: "Features of business environment",
      def: "Business environment is (i) the <b>totality of external forces</b>, (ii) made up of both <b>specific and general forces</b>, (iii) <b>inter-related</b>, (iv) <b>dynamic</b>, (v) <b>uncertain</b>, (vi) <b>complex</b>, and (vii) <b>relative</b> - it differs from country to country and region to region.",
      q: "Seven features, so a full 6-mark answer needs six of them with headings. Do not confuse the <b>features</b> of the environment with the <b>importance</b> of understanding it (first mover advantage, early warning signal, tapping useful resources, coping with rapid changes, assisting in planning and policy formulation, improving performance)."
    },
    'specific-environment': {
      term: "Specific forces / specific environment",
      def: "Specific forces - such as <b>investors, customers, competitors and suppliers</b> - are those which affect an <b>individual enterprise directly and immediately</b> in its day-to-day working.",
      q: "Not the same as general forces: specific forces affect <b>one firm directly</b>, general forces affect <b>all firms indirectly</b>. A new competitor opening next door is specific; a rise in the inflation rate is general."
    },
    'general-environment': {
      term: "General forces / general environment",
      def: "General forces - such as <b>social, political, legal and technological conditions</b> - have an impact on <b>all business enterprises alike</b>, and therefore affect an individual firm only <b>indirectly</b>.",
      q: "The five dimensions of the business environment (economic, social, technological, political, legal) are all <b>general</b> forces. Customers and suppliers are <b>specific</b>."
    },
    'economic-environment': {
      term: "Economic environment",
      def: "The economic environment consists of forces such as <b>interest rates, inflation rates, changes in the disposable income of people, stock market indices, the value of the rupee and the rate of growth of GDP</b>, which affect the demand for a firm's products and its costs. For example, <b>low long-term interest rates</b> benefit construction and automobile firms because consumers borrow to buy homes and cars.",
      q: "Money-related forces are economic; <b>laws</b> about money (a GST rate notification, a SEBI regulation) are <b>legal</b>. A change in the RBI repo rate is economic; the Act that empowers the RBI is legal."
    },
    'social-environment': {
      term: "Social environment",
      def: "The social environment consists of the <b>customs and traditions, values, social trends, literacy rate, life expectancy, consumption habits, composition of the family and society's expectations from business</b> within which the enterprise operates. For example, the demand created for sweets, gifts and greeting cards during <b>Deepawali</b>, or the rise in demand for health foods as health awareness grows.",
      q: "Social is about <b>people's beliefs and habits</b>; economic is about <b>their money</b>. A shift to nuclear families is social; a rise in their disposable income is economic."
    },
    'technological-environment': {
      term: "Technological environment",
      def: "The technological environment consists of the forces relating to <b>scientific improvements and innovations</b> which provide <b>new ways of producing goods and services</b> and new methods and techniques of operating a business - for example the shift from cash counters to <b>UPI and digital payments</b>, or from film cameras to smartphone cameras.",
      q: "Technological change is often mistaken for economic change. The <b>invention</b> of a cheaper process is technological; the <b>fall in cost</b> that follows is economic."
    },
    'political-environment': {
      term: "Political environment",
      def: "The political environment consists of <b>political conditions such as the general stability and peace in the country</b> and the <b>specific attitudes that elected government representatives hold towards business</b>. Political stability builds confidence among business people to invest in <b>long-term projects</b>; political instability shakes it.",
      q: "Not the same as legal: political environment is about <b>who governs, how stable they are and their attitude to business</b>; legal environment is about the <b>actual laws, orders and court judgments</b> a firm must obey."
    },
    'legal-environment': {
      term: "Legal environment",
      def: "The legal environment consists of the <b>various legislations passed by Government</b>, the <b>administrative orders</b> issued by government authorities, <b>court judgments</b>, and the decisions of the <b>various commissions and agencies</b> at every level of government. For example, advertisements for alcohol are prohibited and cigarette packets must carry a statutory warning.",
      q: "Legal is the <b>rule on the statute book</b>; political is the <b>government's attitude and stability</b>. A ban on a product is legal; a change of government that makes such bans likely is political."
    },
    'liberalisation': {
      term: "Liberalisation",
      def: "Liberalisation means <b>freeing Indian business and industry from unnecessary controls and restrictions</b> - it signalled the <b>end of the licence-permit-quota raj</b>. Introduced by the <b>New Industrial Policy of July 1991</b>, it involved <b>abolishing licensing</b> in most industries, <b>freedom in deciding the scale of business</b>, <b>removal of restrictions on the movement of goods and services</b>, <b>freedom in fixing prices</b>, <b>reduction in tax rates</b>, and <b>simplified import-export procedures</b>.",
      q: "Liberalisation removes <b>controls</b>; privatisation transfers <b>ownership</b>; globalisation opens the economy to the <b>world</b>. All three date from <b>1991</b> and are history, not current policy - date them on the slide."
    },
    'privatisation': {
      term: "Privatisation",
      def: "Privatisation means giving a <b>greater role to the private sector</b> and a <b>reduced role to the public sector</b> in the nation-building process. Under the <b>New Industrial Policy, 1991</b> the Government dereserved industries and adopted a policy of planned <b>disinvestment</b> - the transfer of ownership in public sector enterprises to the private sector. Dilution of Government ownership <b>beyond 51 per cent</b> transfers both ownership and management.",
      q: "Disinvestment is the <b>method</b>; privatisation is the <b>policy</b>. Do not confuse it with liberalisation, which removes controls but does not change who owns the firm."
    },
    'globalisation': {
      term: "Globalisation",
      def: "Globalisation means the <b>integration of the various economies of the world</b> leading towards the emergence of a <b>cohesive global economy</b>. In India it was pursued through <b>import liberalisation</b>, <b>export promotion by rationalising the tariff structure</b>, and <b>reforms in foreign exchange</b>, so that physical distance and political boundaries no longer bar a firm from serving a distant customer.",
      q: "Globalisation is about <b>crossing national boundaries</b>; liberalisation is about <b>removing domestic controls</b>. Note that opening a factory abroad is globalisation, whereas dropping an industrial licence requirement is liberalisation."
    },
    'demonetisation': {
      term: "Demonetisation",
      def: "Demonetisation is the act of <b>stripping a currency unit of its status as legal tender</b>. On <b>8 November 2016</b> the Government of India demonetised the <b>₹500 and ₹1,000 notes</b>, which were about <b>86 per cent of the currency in circulation</b>, with the aim of <b>curbing corruption, counterfeiting, the use of high denomination notes for illegal activities, and the accumulation of black money</b>.",
      q: "Its <b>four features</b> are examinable: it is (i) a <b>tax administration measure</b>, (ii) a signal that <b>tax evasion will no longer be tolerated</b>, (iii) a <b>channelling of savings into the formal financial system</b>, and (iv) a move towards a <b>less-cash or cash-lite economy</b>. Demonetisation is a change in the <b>economic and legal</b> environment - it is not the same as devaluation, which lowers the exchange value of the currency."
    },
    'planning': {
      term: "Planning",
      def: "Planning is <b>deciding in advance what to do, how to do it, when to do it and who is to do it</b>. It <b>bridges the gap between where we are and where we want to reach</b>. Planning is the <b>primary function of management</b> because it <b>precedes all other functions</b>, and it is a <b>mental exercise</b> involving <b>decision making</b> - choosing the best alternative.",
      q: "Not the same as controlling, and the paper always tests the pair: <b>planning is prescriptive and looks ahead</b>, <b>controlling is evaluative and looks back</b>. Planning sets the standard, controlling measures performance against it, and the deviations controlling reveals become the premises of the next plan - <b>planning without controlling is meaningless, controlling without planning is blind</b>. Note also that planning does <b>not</b> guarantee success and does <b>not</b> eliminate risk; its limitations (rigidity, does not work in a dynamic environment, reduces creativity, involves huge costs, is time consuming, false sense of security) are examined as often as its importance."
    },
    'planning-process': {
      term: "Planning process",
      def: "The seven steps are: (1) <b>Setting objectives</b>, (2) <b>Developing premises</b> (the assumptions about the future on which the plan is based), (3) <b>Identifying alternative courses of action</b>, (4) <b>Evaluating alternative courses</b>, (5) <b>Selecting an alternative</b> - the real point of decision making, (6) <b>Implementing the plan</b>, and (7) <b>Follow-up action</b>.",
      q: "The step students omit is <b>developing premises</b>, and it is worth a full mark. Note that step 7 (follow-up) is where planning hands over to <b>controlling</b> - the two functions are inseparable."
    },
    'single-use-plan': {
      term: "Single-use plan",
      def: "A single-use plan is developed for a <b>one-time event or project</b> - a course of action <b>not likely to be repeated in future</b>, i.e. for <b>non-recurring situations</b>. <b>Budgets, programmes and projects</b> are single-use plans.",
      q: "Not the same as a standing plan: a single-use plan is used <b>once and discarded</b>; a standing plan is used <b>again and again</b> for recurring activities. Learn the two lists together - budget, programme, project (single-use) versus policy, procedure, method, rule (standing)."
    },
    'standing-plan': {
      term: "Standing plan",
      def: "A standing plan is used for <b>activities that occur regularly over a period of time</b>. It is <b>developed once and modified from time to time</b> to meet business needs, and it greatly enhances <b>efficiency in routine decision making</b>. <b>Policies, procedures, methods and rules</b> are standing plans.",
      q: "Not the same as a single-use plan. Note also that <b>objectives</b> and <b>strategy</b> are classified as <b>neither</b> - they belong to strategic, not operational, planning."
    },
    'objective': {
      term: "Objective (as a type of plan)",
      def: "Objectives are the <b>ends which the management seeks to achieve</b> by its operations - the <b>desired future position</b> the organisation would like to reach. They are set by <b>top management</b>, serve as a <b>guide for overall planning</b>, and must be expressed in <b>specific, measurable terms within a given time period</b>, for example increasing sales by 10 per cent this year.",
      q: "An objective states <b>what</b> is to be achieved; a <b>strategy</b> states the <b>comprehensive plan for how</b> it will be achieved. Setting objectives is also the <b>first step of the planning process</b>."
    },
    'strategy': {
      term: "Strategy",
      def: "A strategy is a <b>comprehensive plan for accomplishing an organisation's objectives</b>. Every strategy has <b>three dimensions</b> - (i) <b>determining long-term objectives</b>, (ii) <b>adopting a particular course of action</b>, and (iii) <b>allocating the resources</b> necessary to achieve the objective. A strategy is always formulated keeping the <b>business environment</b> in view.",
      q: "The three dimensions are the mark. A strategy is <b>neither a single-use nor a standing plan</b> - it is part of <b>strategic</b> planning. Distinguish from <b>policy</b>: a strategy is the overall plan of action, a policy is a general guideline for decisions taken while implementing it."
    },
    'policy': {
      term: "Policy",
      def: "Policies are <b>general statements that guide thinking and channelise energies</b> towards a particular direction. They are <b>guides to managerial action and decision making</b> in the implementation of a strategy, and they define the <b>broad parameters within which a manager may use his discretion</b> - for example a recruitment policy or a pricing policy.",
      q: "Not the same as a rule: a policy <b>allows discretion</b> in interpretation, a rule <b>allows none</b>. 'Customer is always right' is a policy; 'No smoking in the factory' is a rule."
    },
    'procedure': {
      term: "Procedure",
      def: "Procedures are the <b>routine steps on how to carry out an activity</b>, specified in <b>chronological order</b>. They detail the <b>exact manner in which a work is to be performed</b>, are generally meant for <b>insiders</b> to follow, and are the steps taken <b>within a broad policy framework</b> to enforce that policy.",
      q: "Not the same as a method: a procedure is the <b>whole sequence of steps</b>; a method is the <b>prescribed way of performing one step</b> of that procedure."
    },
    'method': {
      term: "Method",
      def: "A method provides the <b>prescribed way or manner in which one step of a procedure has to be performed</b>. Selecting a proper method <b>saves time, money and effort and increases efficiency</b> - for example, lectures and seminars for training top managers, but on-the-job training at the supervisory level.",
      q: "Method is <b>one step</b> of a procedure done a particular way; <b>procedure</b> is the whole ordered sequence. Both are <b>standing plans</b>."
    },
    'rule': {
      term: "Rule",
      def: "Rules are <b>specific statements that tell what is to be done and what is not to be done</b>. They <b>do not allow any flexibility or discretion</b> and reflect a managerial decision that a certain action must or must not be taken. They are the <b>simplest type of plan</b> - for example, 'No Smoking in the factory premises'.",
      q: "Not the same as a policy: a rule is <b>rigid and carries a penalty for breach</b>; a policy is a <b>general guideline that leaves room for judgment</b>. A rule is a <b>standing plan</b>, because it applies again and again."
    },
    'budget': {
      term: "Budget",
      def: "A budget is a <b>statement of expected results expressed in numerical terms</b> - it <b>quantifies future facts and figures</b>, for example a sales budget or a cash budget. Because everything in it is in numbers, <b>actual figures can be compared with expected figures</b> and corrective action taken.",
      q: "A budget is a <b>single-use plan</b>, and it is <b>both a plan and a control device</b> - making it involves <b>forecasting</b>, which is planning, but it later reappears in Chapter 8 as the controlling technique of <b>budgetary control</b>."
    },
    'programme': {
      term: "Programme",
      def: "A programme is a <b>detailed statement about a project</b> which outlines the <b>objectives, policies, procedures, rules, tasks, the human and physical resources required and the budget</b> needed to implement any course of action. It covers the entire gamut of activities down to the minutest detail.",
      q: "A programme is a <b>single-use plan</b>, and it is the <b>broadest</b> of the operational plans - a programme <b>contains</b> procedures, rules and budgets within it. Do not confuse it with a procedure, which is only one ordered sequence of steps."
    },

    /* ---- Units 5-8  ·  Organising · Staffing · Directing · Controlling ---- */
    'organising': {
      term: "Organising",
      def: "Organising is the <b>process of identifying and grouping the work</b> to be performed, <b>defining and delegating responsibility and authority</b>, and <b>establishing relationships</b> for the purpose of enabling people to work most effectively together in accomplishing objectives. (Louis Allen)",
      q: "The word is used in two senses and the question tells you which: as a <i>process</i> (the steps a manager follows) and as a <i>structure</i> (the framework those steps produce). 'Steps in organising' wants the process; 'organisation structure' wants the framework."
    },
    'organisation-structure': {
      term: "Organisation structure",
      def: "The organisation structure is the <b>framework within which managerial and operating tasks are performed</b>. It specifies the <b>relationships between people, work and resources</b>, and is depicted in an <b>organisation chart</b>.",
      q: "Not the same as organising: organising is the <b>process</b>, the structure is its <b>output</b>. Structure is of two types - <b>functional</b> and <b>divisional</b>."
    },
    'organising-process': {
      term: "Process of organising",
      def: "Four steps: <b>(1) Identification and division of work</b> into manageable activities; <b>(2) Departmentalisation</b> - grouping activities of a similar nature into departments; <b>(3) Assignment of duties</b> to those best fitted to perform them; and <b>(4) Establishing authority and reporting relationships</b>, so each person knows whom he takes orders from and to whom he is accountable."
    },
    'functional-structure': {
      term: "Functional structure",
      def: "A functional structure is one in which <b>jobs of a similar nature are grouped together</b> and organised as <b>separate departments</b> - production, purchase, marketing, finance and personnel - each headed by a functional head. It is suitable for an organisation that is <b>large, has a single product line</b> and requires a <b>high degree of specialisation</b>.",
      q: "Not the same as divisional structure: a functional structure divides work by <b>function</b> and suits a <b>single product line</b>; a divisional structure divides it by <b>product</b>, each division being <b>multifunctional</b> and a <b>profit centre</b>."
    },
    'divisional-structure': {
      term: "Divisional structure",
      def: "A divisional structure is one in which the organisation is divided into <b>separate business units or divisions, each based on a product line</b>. Each division is <b>multifunctional</b> - production, marketing and finance are performed within it - is headed by a <b>divisional manager responsible for its performance</b>, and works as a <b>profit centre</b>. It suits firms with <b>multiple, diversified product lines</b>.",
      q: "Not the same as functional structure: divisional groups jobs by <b>product</b>, functional groups them by <b>function</b>. Responsibility for profit can be <b>fixed on a divisional head</b>, but is <b>difficult to fix</b> in a functional structure."
    },
    'formal-organisation': {
      term: "Formal organisation",
      def: "Formal organisation refers to the <b>organisation structure deliberately designed by the management</b> to accomplish a particular task. It <b>clearly specifies the boundaries of authority and responsibility</b> and provides <b>systematic coordination</b> among activities so that organisational goals are achieved.",
      q: "Not the same as informal organisation: formal organisation is <b>deliberately created by management</b> and arises from <b>rules and procedures</b>, and its authority flows <b>downward</b>; informal organisation <b>arises spontaneously</b> from social interaction, has <b>no written rules</b>, and its authority flows in <b>any direction</b>."
    },
    'informal-organisation': {
      term: "Informal organisation",
      def: "Informal organisation is the <b>network of social relationships among employees</b> that <b>emerges spontaneously</b> within the formal organisation when people interact beyond their officially defined roles. It has <b>no written rules</b>, is <b>fluid in form and scope</b>, and its channel of communication is the <b>grapevine</b>.",
      q: "Not the same as formal organisation: informal organisation is <b>not created by management</b> and <b>cannot be abolished</b> - it can only be used intelligently. Formal organisation is <b>deliberately designed</b> and can be changed at will."
    },
    'delegation': {
      term: "Delegation",
      def: "Delegation is the <b>downward transfer of authority from a superior to a subordinate</b>. It is <b>the entrustment of responsibility and authority to another and the creation of accountability for performance</b> (Louis Allen). The manager who delegates <b>remains accountable</b> for the outcome.",
      q: "Not the same as decentralisation: delegation is <b>compulsory</b> and takes place between <b>one superior and one subordinate</b> - no manager can perform all the work alone; decentralisation is an <b>optional policy decision</b> of top management that spreads decision-making authority <b>throughout all levels</b>. Decentralisation is delegation <b>extended to the lowest level</b>."
    },
    'authority': {
      term: "Authority",
      def: "Authority is the <b>right of an individual to command his subordinates and to take action within the scope of his position</b>. It <b>arises from formal position</b>, <b>flows downward</b> from superior to subordinate, and <b>can be delegated</b>.",
      q: "Keep the three elements of delegation apart: <b>authority</b> is the <b>right to command</b> (arises from position, flows downward, can be delegated); <b>responsibility</b> is the <b>obligation to perform</b> (arises from authority, flows upward, cannot be entirely delegated); <b>accountability</b> is <b>answerability for the outcome</b> (arises from responsibility, flows upward, cannot be delegated at all)."
    },
    'responsibility': {
      term: "Responsibility",
      def: "Responsibility is the <b>obligation of a subordinate to properly perform the assigned duty</b>. It <b>arises from delegated authority</b>, <b>flows upward</b> from subordinate to superior, and <b>cannot be entirely delegated</b>. For effective delegation, the <b>authority granted must be commensurate with the responsibility assigned</b>.",
      q: "Not the same as authority or accountability: authority is the <b>right to command</b>, responsibility is the <b>obligation to perform</b>, accountability is <b>answerability for the result</b>. If authority exceeds responsibility it leads to <b>misuse of authority</b>; if responsibility exceeds authority the person is made <b>ineffective</b>."
    },
    'accountability': {
      term: "Accountability",
      def: "Accountability implies <b>being answerable for the final outcome</b> of the assigned task. It <b>arises from responsibility</b>, <b>flows upward</b> from subordinate to superior, and <b>cannot be delegated at all</b>. It is generally <b>enforced through regular feedback</b>.",
      q: "The exam sentence that separates all three: <b>authority is delegated, responsibility is assumed, accountability is imposed.</b> A superior who delegates authority to a subordinate <b>still remains accountable</b> to his own superior for the result."
    },
    'decentralisation': {
      term: "Decentralisation",
      def: "Decentralisation refers to the <b>systematic delegation of decision-making authority throughout all the levels of the organisation</b>, so that decision-making authority is <b>shared with lower levels and placed nearest to the points of action</b>. It is an <b>optional policy decision</b> of top management.",
      q: "Not the same as delegation: delegation is a <b>compulsory</b> one-to-one transfer of authority and is a <b>technique of management</b>; decentralisation is an <b>optional philosophy</b> of the whole organisation and represents <b>delegation extended to the lowest level</b>. Delegation creates a <b>superior-subordinate relationship</b>; decentralisation creates <b>semi-autonomous units</b>."
    },
    'centralisation': {
      term: "Centralisation",
      def: "An organisation is centralised when <b>decision-making authority is retained by the higher levels of management</b>. Centralisation and decentralisation are <b>relative terms</b> - no organisation is ever <b>completely centralised or completely decentralised</b>, because complete centralisation would remove the need for a management hierarchy and complete decentralisation would remove the need for higher management.",
      q: "Careful - the word is used in two senses. As <b>Fayol's principle</b> (Chapter 2) it is a question of <b>degree</b>: every organisation needs a balance of centralisation and decentralisation, and neither extreme is recommended. In <b>Chapter 5</b> it is simply the <b>opposite of decentralisation</b> - the systematic retention of decision-making authority at the top."
    },
    'span-of-management': {
      term: "Span of management",
      def: "Span of management refers to the <b>number of subordinates that can be effectively managed by a superior</b>. It gives shape to the organisation structure: a <b>narrow span produces a tall structure with many levels</b>, and a <b>wide span produces a flat structure with fewer levels</b>."
    },
    'staffing': {
      term: "Staffing",
      def: "Staffing is the <b>managerial function of filling and keeping filled the positions in the organisation structure</b>. It is achieved by first identifying the requirement of the work force, followed by <b>recruitment, selection, placement, training, appraisal, promotion and development</b> of personnel.",
      q: "Staffing is <b>both a line and a staff activity</b> - an essential function of <b>every manager</b>, and also the advisory work of the <b>Human Resource Department</b>. Do not restrict it to the HR department in an answer."
    },
    'human-resource-management': {
      term: "Human Resource Management",
      def: "Human Resource Management is the <b>specialised branch of management that carries out the staffing function</b> in a large organisation. Its specialised duties include <b>recruitment, analysing jobs and preparing job descriptions, developing compensation and incentive plans, training and development, maintaining labour and union-management relations, handling grievances and complaints, providing social security and welfare</b>, and <b>defending the company in law suits</b>.",
      q: "Not a different function from staffing: HRM is <b>staffing performed by specialists</b>. Staffing remains a duty of <b>every manager</b>; the HR department only provides <b>expert, advisory support</b>."
    },
    'staffing-process': {
      term: "Process of staffing",
      def: "The steps are <b>(1) Estimating manpower requirements</b>, <b>(2) Recruitment</b>, <b>(3) Selection</b>, <b>(4) Placement and orientation</b>, <b>(5) Training and development</b>, <b>(6) Performance appraisal</b>, <b>(7) Promotion and career planning</b> and <b>(8) Compensation</b>."
    },
    'recruitment': {
      term: "Recruitment",
      def: "Recruitment is the <b>process of searching for prospective employees and stimulating them to apply for jobs</b> in the organisation. It is a <b>positive process</b> because its objective is to <b>create a large pool of prospective candidates</b>.",
      q: "Not the same as selection: recruitment is <b>positive</b> - it <b>attracts</b> applicants and <b>enlarges</b> the pool; selection is <b>negative</b> - it <b>rejects</b> the unsuitable and <b>narrows</b> the pool down to the right person. <b>Recruitment always precedes selection.</b>"
    },
    'internal-sources-of-recruitment': {
      term: "Internal sources of recruitment",
      def: "Filling a vacancy from <b>within the organisation</b>, through <b>(i) transfers</b> - a horizontal shift with no substantial change in responsibility, status or pay - and <b>(ii) promotions</b> - a vertical shift to a higher post carrying <b>greater responsibility, higher status and more pay</b>.",
      q: "Merits: it <b>motivates employees</b>, is <b>economical</b>, simplifies the process of selection and placement, and the person is already known. Limitation: it brings in <b>no fresh talent</b>, and the post vacated by the transfer or promotion <b>still has to be filled</b>."
    },
    'external-sources-of-recruitment': {
      term: "External sources of recruitment",
      def: "Filling a vacancy from <b>outside the organisation</b>. The main sources are <b>direct recruitment</b> (a notice at the factory gate), <b>casual callers</b>, <b>advertisement</b>, <b>employment exchange</b>, <b>placement agencies and management consultants</b>, <b>campus recruitment</b>, <b>recommendations of present employees</b>, <b>labour contractors</b>, <b>advertising on television</b> and <b>web publishing</b>.",
      q: "Merits: <b>qualified personnel</b>, a <b>wider choice</b> and the injection of <b>fresh talent</b>. Limitations: <b>dissatisfaction among existing staff</b>, a <b>lengthy process</b> and a <b>costly process</b>."
    },
    'selection': {
      term: "Selection",
      def: "Selection is the <b>process of identifying and choosing the best person out of a number of prospective candidates</b> for a job. It is a <b>negative process</b> because at every stage candidates are <b>eliminated</b> until the right type is found.",
      q: "Not the same as recruitment: recruitment <b>invites</b> applications and is <b>positive</b>; selection <b>rejects</b> and is <b>negative</b>. Recruitment is <b>simple and inexpensive</b>; selection is <b>complex, time-consuming and costly</b> because it involves a series of tests and interviews."
    },
    'preliminary-screening': {
      term: "Preliminary screening",
      def: "The <b>first step of selection</b>, in which the manager <b>eliminates unqualified or unfit job seekers</b> on the basis of the information supplied in the <b>application forms</b>. Preliminary interviews at this stage help reject misfits for reasons that did not appear in the application form."
    },
    'selection-test': {
      term: "Selection test",
      def: "An employment test is a <b>mechanism that attempts to measure certain characteristics of individuals</b>. The main types are the <b>intelligence test</b> (learning ability and judgment), the <b>aptitude test</b> (potential for learning new skills), the <b>personality test</b> (emotions, reactions, maturity and value system), the <b>trade test</b> (skills already possessed) and the <b>interest test</b>.",
      q: "The examiner's favourite pair: an <b>aptitude test measures the potential to acquire a skill</b>, whereas a <b>trade test measures the actual skill already possessed</b>."
    },
    'employment-interview': {
      term: "Employment interview",
      def: "An interview is a <b>formal, in-depth conversation conducted to evaluate the applicant's suitability for the job</b>. The role of the <b>interviewer is to seek information</b> and that of the <b>interviewee is to provide it</b>, though today the interviewee also seeks information from the interviewer."
    },
    'reference-and-background-check': {
      term: "Reference and background check",
      def: "The step at which the employer <b>verifies the information supplied by the applicant and gains additional information about him</b>, by asking for the <b>names, addresses and telephone numbers of references</b>. <b>Previous employers, known persons, teachers and university professors</b> can act as references."
    },
    'selection-decision': {
      term: "Selection decision",
      def: "The step at which the <b>final decision is made from among the candidates who have passed the tests, interviews and reference checks</b>. The <b>views of the concerned manager</b> are generally given weight, because it is he who is <b>responsible for the performance of the new employee</b>."
    },
    'medical-examination': {
      term: "Medical examination",
      def: "A <b>medical fitness test</b> that the candidate is required to undergo <b>after the selection decision and before the job offer is made</b>. The job offer is given only to the candidate who is <b>declared fit</b> after this examination.",
      q: "The order is examinable: medical examination comes <b>after the selection decision and before the job offer</b> - it is <b>not</b> the last step, and it is <b>not</b> before the interview."
    },
    'job-offer': {
      term: "Job offer",
      def: "The job offer is made to the applicant who has <b>cleared all the previous hurdles</b>, through a <b>letter of appointment</b>. The letter generally contains <b>a date by which the appointee must report on duty</b>, and he must be given <b>reasonable time for reporting</b>."
    },
    'contract-of-employment': {
      term: "Contract of employment",
      def: "After the job offer has been made and the candidate accepts it, a <b>contract of employment</b> is executed - a <b>written document containing the terms and conditions of employment</b> such as <b>job title, duties, pay and allowances, hours of work, leave rules, probation period</b> and <b>termination of employment</b>."
    },
    'induction-training': {
      term: "Induction / orientation training",
      def: "Orientation or induction is the process of <b>introducing the selected employee to the other employees and familiarising him with the rules and policies of the organisation</b>. He is given a brief presentation about the company, <b>introduced to his superiors, subordinates and colleagues</b>, and taken around the workplace.",
      q: "Not the same as placement: <b>placement</b> is the employee <b>occupying the post</b> for which he has been selected; <b>orientation</b> is <b>familiarising him with the people, rules and policies</b> of the organisation."
    },
    'training': {
      term: "Training",
      def: "Training is <b>any process by which the aptitudes, skills and abilities of employees to perform specific jobs are increased</b>. It is a <b>job-oriented</b>, <b>short-term</b> process which aims to <b>improve performance on the current job</b>.",
      q: "Not the same as development: training <b>increases knowledge and skills</b>, is <b>job-oriented</b> and <b>short-term</b>, and enables the employee to <b>do the job better</b>; development is <b>learning and growth</b>, is <b>career-oriented</b> and <b>ongoing</b>, and aims at the <b>overall growth of the employee</b>. <b>Development includes training.</b>"
    },
    'development': {
      term: "Development",
      def: "Development refers to the <b>learning opportunities designed to help employees grow</b>. It covers not only the activities that improve job performance but also those that bring about <b>growth of the personality</b> and help the individual progress towards <b>maturity and actualisation of his potential capacities</b>. It is <b>career-oriented</b> and is an <b>ongoing process</b>.",
      q: "Not the same as training: development is <b>broader</b> and is aimed at the <b>whole career and personality</b>; training is <b>narrower</b> and aimed at the <b>present job</b>. Development <b>includes</b> training, never the other way round."
    },
    'on-the-job-training': {
      term: "On-the-job methods",
      def: "On-the-job methods are those <b>applied at the workplace while the employee is actually working</b> - they mean <b>learning while doing</b>. They include <b>apprenticeship programmes, coaching, internship training</b> and <b>job rotation</b>.",
      q: "Not the same as off-the-job methods: on-the-job means <b>learning while doing</b>, at the actual workplace; off-the-job means <b>learning before doing</b>, away from the workplace."
    },
    'off-the-job-training': {
      term: "Off-the-job methods",
      def: "Off-the-job methods are those <b>used away from the actual workplace</b> - they mean <b>learning before doing</b>. They include <b>classroom lectures and conferences, films, case studies, computer modelling, vestibule training</b> and <b>programmed instruction</b>.",
      q: "Not the same as on-the-job methods: the test is <b>where the training happens</b>, not what equipment is used. <b>Vestibule training</b> uses the real machines yet is <b>off-the-job</b>, because it is conducted away from the actual work floor."
    },
    'apprenticeship-training': {
      term: "Apprenticeship training",
      def: "Apprenticeship programmes put the <b>trainee under the guidance of a master worker</b> for a <b>prescribed period of time</b>, in order to acquire a <b>higher level of skill</b>. People seeking to enter <b>skilled trades</b> - plumbers, electricians, iron-workers - are often required to undergo it. It is an <b>on-the-job</b> method.",
      q: "Not the same as internship training: apprenticeship is a <b>long, prescribed period spent working under a master worker</b> to master a skilled trade; internship is a <b>joint programme of an educational institution and a business firm</b> in which the candidate continues his studies while gaining practical experience."
    },
    'internship-training': {
      term: "Internship training",
      def: "Internship training is a <b>joint programme of training in which educational institutions and business firms cooperate</b>. Selected candidates <b>carry on their regular studies</b> for the prescribed period and <b>also work in a factory or office</b> to acquire practical knowledge and skills. It is an <b>on-the-job</b> method.",
      q: "Not the same as apprenticeship: the interne is <b>primarily a student</b> earning practical exposure alongside a course; the apprentice is <b>primarily a trainee worker</b> being taught a trade by a master worker."
    },
    'vestibule-training': {
      term: "Vestibule training",
      def: "In vestibule training, <b>employees learn their jobs on the equipment they will actually be using, but the training is conducted away from the actual work floor</b>. An <b>actual work environment is created in a classroom</b> with the same materials, files and equipment. It is used when employees have to handle <b>sophisticated machinery and equipment</b>.",
      q: "Classification trap: even though the real machines are used, vestibule training is an <b>off-the-job method</b>, because it takes place <b>away from the actual work floor</b> and so does not disturb production."
    },
    'job-rotation': {
      term: "Job rotation",
      def: "Job rotation involves <b>shifting the trainee from one department to another or from one job to another</b>, so that he gains a <b>broader understanding of all parts of the business</b> and can test his own aptitude and ability. It is an <b>on-the-job</b> method, and it makes <b>promotions, transfers and replacements easier</b>.",
      q: "Not the same as job enrichment: job rotation moves a person <b>across several jobs</b> and is a <b>training method</b>; job enrichment makes <b>one job deeper and more challenging</b> and is a <b>non-financial incentive</b>."
    },
    'directing': {
      term: "Directing",
      def: "Directing refers to the <b>process of instructing, guiding, counselling, motivating and leading people</b> in the organisation to achieve its objectives. Its four elements are <b>supervision, motivation, leadership</b> and <b>communication</b>, and it is <b>initiated at the top and flows down the chain of command</b>."
    },
    'supervision': {
      term: "Supervision",
      def: "Supervision means <b>overseeing what is being done by subordinates and giving them instructions to ensure the optimum utilisation of resources and the achievement of work targets</b>. As an <b>element of directing</b> it is performed by <b>every manager at every level</b>.",
      q: "Two distinct senses, and the paper uses both. As an <b>element of directing</b>, supervision is done by <b>every manager at all levels</b>. As a <b>level of management</b>, the <b>supervisor</b> is the operative-level manager placed <b>immediately above the workers</b>, who acts as the <b>link between workers and management</b>."
    },
    'motivation': {
      term: "Motivation",
      def: "Motivation is the <b>process of stimulating people to action to accomplish desired goals</b>, and it depends upon <b>satisfying the needs of people</b>. It is an <b>internal feeling</b>, produces <b>goal-directed behaviour</b>, may be <b>positive or negative</b>, and is a <b>complex process</b> because individuals differ.",
      q: "Not the same as leadership: motivation is the process of <b>inducing a person to work willingly by satisfying his needs</b>; leadership is the process of <b>influencing the behaviour of people</b> so that they strive willingly towards group goals. Motivating is <b>one of the things a leader does</b> - it is not the whole of leadership."
    },
    'motive': {
      term: "Motive",
      def: "A motive is an <b>inner state that energises, activates or moves and directs behaviour towards goals</b>. Motives <b>arise out of the needs of individuals</b> - hunger, thirst, security, affiliation, comfort and recognition - and a motive causes <b>restlessness</b> which prompts action to reduce it.",
      q: "Keep the three apart: a <b>motive</b> is the <b>inner urge</b>; <b>motivation</b> is the <b>process of stimulating action</b> to satisfy it; an <b>incentive</b> is the <b>reward offered by the organisation</b> to induce that action."
    },
    'incentive': {
      term: "Incentive",
      def: "An incentive means <b>all measures which are used to motivate people to improve performance</b>. Incentives are of two kinds - <b>financial incentives</b>, which are in monetary form, and <b>non-financial incentives</b>, which satisfy psychological, social and emotional needs.",
      q: "An incentive is <b>external</b> - something the organisation offers; a <b>motive</b> is <b>internal</b> - something inside the individual. The incentive works only if it matches the motive."
    },
    'maslow-hierarchy': {
      term: "Maslow's Need Hierarchy Theory",
      def: "Abraham Maslow held that <b>within every human being there exists a hierarchy of five needs</b> - <b>basic physiological, safety/security, affiliation/belonging, esteem</b> and <b>self-actualisation</b>. Its assumptions are that <b>people's behaviour is based on their needs</b>, that <b>needs are satisfied in a hierarchical order from the lowest upward</b>, and that <b>a satisfied need no longer motivates</b>."
    },
    'physiological-needs': {
      term: "Basic physiological needs",
      def: "The <b>most basic needs in Maslow's hierarchy</b>, corresponding to primary needs - <b>hunger, thirst, shelter and sleep</b>. In the organisational context they are satisfied by <b>basic salary</b>."
    },
    'safety-needs': {
      term: "Safety / security needs",
      def: "Needs that provide <b>security and protection from physical and emotional harm</b>. In the organisational context they are satisfied by <b>job security, stability of income and pension plans</b>.",
      q: "Do not confuse with esteem needs: safety needs are about <b>protection and certainty</b>; esteem needs are about <b>status and recognition</b>. <b>Job security</b> serves safety needs; a <b>job title</b> serves esteem needs."
    },
    'affiliation-needs': {
      term: "Affiliation / belonging needs",
      def: "Needs that refer to <b>affection, a sense of belongingness, acceptance and friendship</b>. In the organisational context they are satisfied by <b>friendly work groups, team work</b> and <b>good relations with superiors and colleagues</b>."
    },
    'esteem-needs': {
      term: "Esteem needs",
      def: "Needs that include factors such as <b>self-respect, autonomy, status, recognition and attention</b>. In the organisational context they are satisfied by <b>a higher designation, praise, employee recognition programmes</b> and <b>status symbols</b>."
    },
    'self-actualisation-needs': {
      term: "Self-actualisation needs",
      def: "The <b>highest level of need in Maslow's hierarchy</b>. It refers to the <b>drive to become what one is capable of becoming</b> - growth, the realisation of one's potential and self-fulfilment. In the organisational context it is satisfied by <b>challenging work offering scope for creativity and personal growth</b>."
    },
    'financial-incentives': {
      term: "Financial incentives",
      def: "Financial incentives are those <b>incentives which are in direct monetary form or measurable in monetary terms and serve to satisfy the economic needs of employees</b>. They include <b>pay and allowances, productivity-linked wage incentives, bonus, profit sharing, co-partnership / stock option, retirement benefits</b> and <b>perquisites</b>.",
      q: "Not the same as non-financial incentives: financial incentives satisfy <b>economic needs</b> and are <b>measurable in money</b>. A non-financial incentive such as <b>promotion</b> may involve extra money, but its <b>non-monetary aspects over-ride the monetary ones</b> - so it is still classified as non-financial."
    },
    'non-financial-incentives': {
      term: "Non-financial incentives",
      def: "Non-financial incentives are those which focus on the <b>psychological, social and emotional needs</b> of employees rather than on money. They are <b>status, organisational climate, career advancement opportunity, job enrichment, employee recognition programmes, job security, employee participation</b> and <b>employee empowerment</b>.",
      q: "Not the same as financial incentives: the test is <b>which need is being satisfied</b>, not whether money changes hands. Emphasis on <b>psychological and emotional satisfaction</b> makes an incentive non-financial even if some money is attached."
    },
    'status': {
      term: "Status (as an incentive)",
      def: "In the organisational context, status means the <b>ranking of a position in the organisation</b>. The <b>authority, responsibility, rewards, recognition, perquisites and prestige</b> attached to a job indicate the status given to the person holding it. It satisfies <b>psychological, social and esteem needs</b>."
    },
    'organisational-climate': {
      term: "Organisational climate",
      def: "Organisational climate indicates the <b>characteristics which describe an organisation and distinguish it from other organisations</b>, and which <b>influence the behaviour of individuals</b> in it - <b>individual autonomy, reward orientation, consideration to employees</b> and <b>risk-taking</b>. A positive climate acts as a non-financial incentive."
    },
    'career-advancement-opportunity': {
      term: "Career advancement opportunity",
      def: "The non-financial incentive of giving employees <b>appropriate skill development programmes and a sound promotion policy</b> so that they can <b>rise to higher-level jobs</b>. <b>Promotion works as a tonic</b> and encourages employees to exhibit improved performance."
    },
    'job-enrichment': {
      term: "Job enrichment",
      def: "Job enrichment is concerned with <b>designing jobs that include a greater variety of work content, require a higher level of knowledge and skill, give workers more autonomy and responsibility, and provide the opportunity for personal growth and a meaningful work experience</b>. When a job is enriched, <b>the job itself becomes a source of motivation</b>.",
      q: "Not the same as job rotation: job enrichment makes <b>one job deeper</b> and is a <b>non-financial incentive</b>; job rotation moves the person <b>across jobs</b> and is an <b>on-the-job training method</b>."
    },
    'employee-recognition': {
      term: "Employee recognition programmes",
      def: "Recognition means <b>acknowledgment with a show of appreciation</b> of the work performed by an employee. Examples are <b>congratulating the employee on good performance, displaying his achievement on the notice board or in the company newsletter, awarding a certificate for best performance, distributing mementoes</b>, and <b>rewarding a valuable suggestion</b>. It satisfies <b>esteem needs</b>."
    },
    'employee-participation': {
      term: "Employee participation",
      def: "Employee participation means <b>involving employees in the decision making of issues related to them</b>, through devices such as <b>joint management committees, work committees and canteen committees</b>. It gives employees a <b>sense of belongingness</b> and makes them <b>more committed to the decision</b>.",
      q: "Not the same as employee empowerment: participation means employees are <b>consulted before</b> a decision is taken; empowerment means <b>authority is actually given to them</b> to take the decision themselves."
    },
    'job-security': {
      term: "Job security",
      def: "Job security means giving employees <b>certain stability about their future income and work</b>, so that they are free of worry and work with greater zeal. It satisfies <b>safety and security needs</b>. Its <b>negative side</b> is that employees who feel they cannot lose their jobs <b>may become complacent</b>."
    },
    'employee-empowerment': {
      term: "Employee empowerment",
      def: "Empowerment means <b>giving more autonomy and powers to subordinates</b>. It makes people <b>feel that their jobs are important</b>, and contributes positively to the use of their skills and talents.",
      q: "Not the same as employee participation: empowerment <b>transfers the power to decide</b>; participation only <b>gives a voice in the decision</b>."
    },
    'leadership': {
      term: "Leadership",
      def: "Leadership is the <b>process of influencing the behaviour of people so that they strive willingly and enthusiastically towards the achievement of group goals</b>. It indicates the <b>ability of an individual to influence others</b>, requires the existence of <b>followers</b>, is exercised to <b>achieve common goals</b> and is a <b>continuous process</b>.",
      q: "Not the same as motivation: leadership is <b>influencing behaviour</b>, motivation is <b>inducing willing action by satisfying needs</b>. A leader <b>uses</b> motivation as one of his tools, along with supervision and communication."
    },
    'autocratic-leadership': {
      term: "Autocratic / authoritarian leadership",
      def: "An autocratic leader <b>gives orders and expects his subordinates to obey them</b>. <b>All authority is centralised in the leader</b>, <b>communication is one-way</b>, and he relies on <b>reward and punishment</b>. This style is effective where <b>quick decisions</b> are needed and where <b>subordinates are unskilled or need close control</b>."
    },
    'democratic-leadership': {
      term: "Democratic / participative leadership",
      def: "A democratic leader <b>develops action plans and makes decisions in consultation with his subordinates</b> and <b>encourages them to participate in decision making</b>. <b>Communication is two-way</b>, and he exercises control by <b>using the forces within the group</b>. It suits <b>experienced and competent subordinates</b>."
    },
    'laissez-faire-leadership': {
      term: "Laissez faire / free-rein leadership",
      def: "A laissez faire or free-rein leader <b>does not believe in the use of power unless it is absolutely essential</b>. The followers are given a <b>high degree of independence to formulate their own objectives and the ways to achieve them</b>; the <b>manager only supports them and supplies the required information</b>, while the <b>subordinate assumes responsibility</b> for the work. It suits <b>highly qualified, self-motivated professionals</b>.",
      q: "Do not read free-rein as an absence of leadership: even a laissez faire leader <b>lays down certain rules</b>, and a democratic leader <b>may have to decide alone in an emergency</b>. A leader chooses a <b>combination of styles according to the situation</b>."
    },
    'communication': {
      term: "Communication",
      def: "Communication is the <b>process of exchange of information between two or more persons to reach a common understanding</b>. Its elements are <b>sender, message, encoding, media / channel, decoding, receiver, noise</b> and <b>feedback</b>.",
      q: "Communication is complete only when <b>the receiver understands the message as the sender intended</b>. Merely sending it is not communication - <b>feedback</b> is what proves the common understanding was reached."
    },
    'formal-communication': {
      term: "Formal communication",
      def: "Formal communication is communication that <b>flows through the official channels designed in the organisation chart</b>. It is generally <b>recorded and filed</b> in the office, and is classified as <b>vertical</b> - <b>upward</b> (subordinate to superior) and <b>downward</b> (superior to subordinate) - and <b>horizontal</b> (among employees of the same cadre).",
      q: "Not the same as informal communication: formal communication follows <b>official channels</b>, is <b>recorded</b> and is <b>slower but reliable</b>; informal communication (the <b>grapevine</b>) arises from <b>social relationships</b>, <b>disregards the levels of authority</b>, is <b>not recorded</b>, and is <b>fast but may be distorted</b>."
    },
    'grapevine': {
      term: "Informal communication (grapevine)",
      def: "Communication that <b>takes place without following the formal lines of communication</b> is informal communication. It is called the <b>grapevine</b> because it <b>spreads throughout the organisation with its branches going out in all directions in utter disregard of the levels of authority</b>. It <b>spreads rapidly</b>, may get <b>distorted</b>, and its <b>source is difficult to detect</b>.",
      q: "Not the same as formal communication: the grapevine arises out of the <b>employees' need to exchange views that cannot be exchanged through formal channels</b>. A wise manager <b>uses its positive aspects</b> to sense reactions rather than trying to abolish it."
    },
    'single-strand-network': {
      term: "Single strand network",
      def: "A grapevine network in which <b>each person communicates with the other in a single sequence</b> - A tells B, B tells C, C tells D, and so on down one chain."
    },
    'gossip-network': {
      term: "Gossip network",
      def: "A grapevine network in which <b>one person communicates with all the others on a non-selective basis</b> - a single individual passes the information to everybody around him.",
      q: "Contrast with the cluster network: gossip is <b>non-selective</b> - the person tells everyone; cluster is <b>selective</b> - the person tells only those he trusts."
    },
    'probability-network': {
      term: "Probability network",
      def: "A grapevine network in which <b>the individual communicates randomly with other individuals</b> - the information travels by chance, with no chosen route or pattern."
    },
    'cluster-network': {
      term: "Cluster network",
      def: "A grapevine network in which <b>the individual communicates with only those people whom he trusts</b>, and they in turn pass it on to their own trusted few. Of the four networks, <b>cluster is the most popular in organisations</b>.",
      q: "The point that earns the mark is <b>selectivity</b> - the sender tells <b>only those he trusts</b>. That is exactly what distinguishes it from the <b>gossip network</b>, where one person tells everyone non-selectively."
    },
    'semantic-barriers': {
      term: "Semantic barriers",
      def: "Semantic barriers are <b>problems and obstructions in the process of encoding and decoding a message into words or impressions</b>. They arise from a <b>badly expressed message, symbols with several meanings, faulty translations, unclarified assumptions</b> and <b>technical jargon</b>, as well as from <b>body language and gesture decoding</b>.",
      q: "Semantic barriers concern the <b>words and symbols themselves</b>; <b>psychological barriers</b> concern the <b>state of mind</b> of the sender or receiver. If the manager used an ambiguous word, it is semantic; if the receiver was angry or inattentive, it is psychological."
    },
    'psychological-barriers': {
      term: "Psychological / emotional barriers",
      def: "Psychological or emotional barriers arise from the <b>state of mind of the sender and the receiver</b> - a worried person cannot communicate properly and an angry receiver cannot grasp the real meaning. They include <b>premature evaluation, lack of attention, loss by transmission and poor retention</b>, and <b>distrust</b> between the communicator and the communicatee."
    },
    'organisational-barriers': {
      term: "Organisational barriers",
      def: "Organisational barriers arise from the <b>organisation structure, authority relationships, rules and regulations</b>. They include an <b>unsupportive organisational policy</b>, <b>rigid rules and regulations</b>, <b>status differences</b>, <b>complexity in the organisation structure</b> with too many levels, and <b>inadequate organisational facilities</b> such as meetings, suggestion boxes and complaint boxes.",
      q: "Distinguish from personal barriers: organisational barriers come from the <b>system</b> - policy, rules, structure; personal barriers come from the <b>individuals</b> - the superior's fear or the subordinate's unwillingness."
    },
    'personal-barriers': {
      term: "Personal barriers",
      def: "Personal barriers arise from the <b>personal factors of the sender and the receiver</b>. They include the superior's <b>fear of challenge to his authority</b>, <b>lack of confidence of the superior in his subordinates</b>, the subordinate's <b>unwillingness to communicate</b>, and the <b>lack of proper incentives</b> to communicate."
    },
    'controlling': {
      term: "Controlling",
      def: "Controlling means <b>ensuring that the activities in an organisation are performed as per the plans</b>. It is the <b>measurement of accomplishment against the standards and the correction of deviations to assure attainment of objectives according to plans</b> (Koontz and Weihrich). It is a <b>goal-oriented</b>, <b>pervasive</b> and <b>continuous</b> function performed at <b>all levels of management</b>.",
      q: "Not the same as planning, and the two are <b>inseparable twins</b>: <b>planning is prescriptive and looks ahead</b>, <b>controlling is evaluative and looks back</b>. But controlling is <b>also forward-looking</b>, because the deviations it reveals become the basis of the next plan - <b>planning without controlling is meaningless, and controlling without planning is blind</b>."
    },
    'controlling-process': {
      term: "Process of controlling",
      def: "Five steps: <b>(1) Setting performance standards</b>, <b>(2) Measurement of actual performance</b>, <b>(3) Comparison of actual performance with standards</b>, <b>(4) Analysing deviations</b>, and <b>(5) Taking corrective action</b>."
    },
    'performance-standards': {
      term: "Performance standards",
      def: "Standards are the <b>criteria against which actual performance is measured</b>; they serve as <b>benchmarks</b> towards which the organisation strives to work. They may be set in <b>quantitative terms</b> - cost to be incurred, revenue to be earned, units to be produced, time to be spent - or in <b>qualitative terms</b>, such as improving goodwill or the motivation level of employees.",
      q: "Standards must be <b>flexible</b> - they may need modification as environmental conditions change. Where possible, prefer standards that can be <b>expressed in numerical or measurable terms</b>, so that comparison is easier."
    },
    'deviation': {
      term: "Deviation",
      def: "A deviation is the <b>difference between actual performance and the standard set</b>. Since some deviation is expected in every activity, the manager must determine the <b>acceptable range of deviation</b>, and <b>deviations in the key areas of business must be attended to more urgently</b> than deviations in insignificant areas."
    },
    'critical-point-control': {
      term: "Critical point control",
      def: "Since it is <b>neither economical nor easy to keep a check on each and every activity</b>, control should <b>focus on the key result areas (KRAs) which are critical to the success of the organisation</b>. These KRAs are set as the <b>critical points</b> - if anything goes wrong at a critical point, the <b>entire organisation suffers</b>.",
      q: "Not the same as management by exception: <b>critical point control decides which areas are worth watching</b>; <b>management by exception decides how large a deviation in those areas is worth reporting</b>. The two are used together in step 4 of the controlling process."
    },
    'management-by-exception': {
      term: "Management by exception",
      def: "Management by exception, often referred to as <b>control by exception</b>, is a principle of management control based on the belief that <b>an attempt to control everything results in controlling nothing</b>. Therefore <b>only significant deviations which go beyond the permissible limit should be brought to the notice of management</b>.",
      q: "Not the same as critical point control: MBE fixes an <b>acceptable range of deviation</b> and reports only what crosses it; critical point control fixes <b>which activities</b> are checked at all. Both <b>save managerial time</b> and <b>facilitate delegation</b>, because routine problems are left to subordinates."
    },
    'corrective-action': {
      term: "Corrective action",
      def: "Taking corrective action is the <b>final step of the controlling process</b>. <b>No corrective action is required when deviations are within acceptable limits</b>; when they go beyond the acceptable range, especially in important areas, they demand <b>immediate managerial attention</b>. If a deviation <b>cannot be corrected through managerial action, the standards themselves may have to be revised</b>.",
      q: "This is the step that makes controlling a <b>forward-looking</b> function - the corrective action feeds into the <b>next round of planning</b>, closing the loop from Chapter 4."
    },

    /* ---- Units 9-12 ·  Financial Management · Financial Markets · Marketing · Consumer Protection ---- */
    'financial-management': {
      term: "Financial Management",
      def: "Financial management is concerned with the <b>optimal procurement</b> of funds and their <b>effective utilisation</b> in the business. Its primary objective is <b>maximisation of shareholders' wealth</b>, which is reflected in the <b>market price of the equity share</b>.",
      q: "The objective is wealth maximisation, <b>not</b> profit maximisation - profit maximisation is vague, ignores <b>risk</b>, and ignores the <b>time value of money</b>."
    },
    'wealth-maximisation': {
      term: "Wealth Maximisation",
      def: "Wealth maximisation means taking every financial decision so as to <b>increase the market value of the equity share</b>. A decision is financially sound only when the <b>benefit exceeds the cost</b>, so that the value of the firm rises.",
      q: "Not the same as profit maximisation: profit maximisation looks at a single year's figure and ignores <b>risk</b> and the <b>timing of returns</b>, whereas wealth maximisation discounts future cash flows and allows for risk."
    },
    'investment-decision': {
      term: "Investment Decision (Capital Budgeting)",
      def: "The investment decision is the decision about <b>where and how much of the firm's funds are to be invested</b> in various assets. The long-term investment decision is called <b>capital budgeting</b>; it involves a large outlay, is <b>irreversible except at a huge loss</b>, and determines the firm's <b>earning capacity, growth and business risk</b>.",
      q: "Not the financing decision: the investment decision asks <b>where to deploy</b> funds (which project or asset); the financing decision asks <b>where to raise</b> them from (debt or equity). The three factors affecting it are <b>cash flows of the project, the rate of return, and the investment criteria</b>."
    },
    'financing-decision': {
      term: "Financing Decision",
      def: "The financing decision is the decision about the <b>quantum of finance to be raised from each long-term source</b> - that is, the proportion of <b>shareholders' funds (equity) and borrowed funds (debt)</b>. It determines the firm's <b>overall cost of capital</b> and its <b>financial risk</b>.",
      q: "Not the investment decision: financing decides the <b>source</b> of funds, investment decides their <b>use</b>. Short-term sources are not covered here - they fall under <b>working capital management</b>."
    },
    'dividend-decision': {
      term: "Dividend Decision",
      def: "The dividend decision is the decision about <b>how much of the profit earned is to be distributed to shareholders as dividend and how much is to be retained</b> in the business. It must be taken so as to <b>maximise the shareholders' wealth</b>.",
      q: "Retained earnings are a source of finance, but the choice to retain is a <b>dividend</b> decision, not a financing decision. Chief factors: <b>amount of earnings, stability of earnings and of dividends, growth opportunities, cash flow position, shareholders' preference, taxation policy, stock market reaction, access to capital market, legal and contractual constraints</b>."
    },
    'financial-planning': {
      term: "Financial Planning",
      def: "Financial planning is the process of <b>estimating the funds requirement of a business and specifying the sources of those funds</b>. Its twin objectives are to <b>ensure availability of funds whenever they are required</b> and to see that the firm <b>does not raise resources unnecessarily</b>.",
      q: "Not the same as a financial decision: planning is the <b>blueprint</b> drawn in advance (a financial plan usually covers 3-5 years), whereas the investment, financing and dividend decisions are the actual choices taken within that blueprint."
    },
    'capital-structure': {
      term: "Capital Structure",
      def: "Capital structure refers to the <b>mix between owners' funds (equity) and borrowed funds (debt)</b> used to finance the business. It is measured by the <b>debt-equity ratio</b>, and is said to be <b>optimal</b> when the proportion of debt and equity <b>maximises the market value of the equity share</b>.",
      q: "Not the same as financial structure: capital structure covers only the <b>long-term</b> sources of finance, whereas financial structure covers <b>all</b> sources on the liabilities side, long-term <b>and</b> short-term."
    },
    'financial-structure': {
      term: "Financial Structure",
      def: "Financial structure refers to the <b>entire composition of the liabilities side of the balance sheet</b> - that is, <b>all</b> the long-term and short-term sources of funds taken together.",
      q: "Capital structure is a <b>part</b> of financial structure. Capital structure = long-term debt + equity; financial structure = capital structure <b>plus current liabilities</b>."
    },
    'trading-on-equity': {
      term: "Trading on Equity",
      def: "Trading on equity refers to the <b>increase in the Earnings Per Share (EPS) of the equity shareholders brought about by the use of debt</b> in the capital structure. It arises only when the <b>Rate of Return on Investment (ROI) is greater than the rate of interest on debt</b>, because debt is a cheaper, fixed-cost source of finance.",
      q: "The effect <b>reverses</b> when ROI falls below the cost of debt - EPS then falls, and this is <b>unfavourable financial leverage</b>. Trading on equity always raises <b>financial risk</b>, so a higher EPS alone does not make a capital structure better."
    },
    'financial-risk': {
      term: "Financial Risk",
      def: "Financial risk is the <b>chance that a firm will fail to meet its fixed financial obligations</b> - interest payment, preference dividend and repayment of principal. It arises from the <b>use of debt</b> and increases as the proportion of debt in the capital structure increases.",
      q: "Not the same as business risk: financial risk arises from <b>fixed financial charges (debt)</b>, business risk from <b>fixed operating costs</b>. <b>Total risk = business risk + financial risk.</b>"
    },
    'business-risk': {
      term: "Business Risk (Operating Risk)",
      def: "Business risk is the risk of the firm <b>not being able to cover its fixed operating costs</b>. It depends on the level of <b>fixed operating costs</b> - the higher the fixed operating costs, the higher the business risk.",
      q: "Business risk exists even in a firm with <b>zero debt</b>; financial risk does not. The <b>higher</b> a firm's business risk, the <b>lower</b> its capacity to take on debt."
    },
    'fixed-capital': {
      term: "Fixed Capital",
      def: "Fixed capital refers to the <b>investment in long-term (fixed) assets</b> such as land, building, plant and machinery - assets which remain in the business for <b>more than one year</b>. Decisions relating to fixed capital are <b>capital budgeting decisions</b>: they involve large amounts and are <b>irreversible except at a huge loss</b>.",
      q: "Not the same as working capital: fixed capital is invested in <b>fixed assets</b> for the long term and affects long-run <b>profitability and growth</b>; working capital is invested in <b>current assets</b> for day-to-day operations and affects <b>liquidity</b>."
    },
    'working-capital': {
      term: "Working Capital",
      def: "Working capital refers to the <b>investment in current assets</b> - cash, debtors, bills receivable and inventory - which get converted into cash <b>within one year</b> and finance the <b>day-to-day operations</b> of the business.",
      q: "Not the same as fixed capital: working capital is invested in <b>current assets</b> for <b>day-to-day operations</b>, is <b>recovered within a year</b> and governs <b>liquidity</b>; fixed capital is invested in <b>fixed assets</b> for the <b>long term</b>, is <b>irreversible except at a huge loss</b> and governs <b>profitability and growth</b>. Current assets are more liquid but yield <b>lower returns</b>, so the firm must balance <b>liquidity against profitability</b>. Chief factors affecting the requirement: <b>nature of business, scale of operations, business cycle, seasonal factors, production cycle, credit allowed and credit availed, operating efficiency, availability of raw material, growth prospects, level of competition and inflation</b>."
    },
    'gross-and-net-working-capital': {
      term: "Gross vs Net Working Capital",
      def: "<b>Gross working capital</b> is the total investment in <b>current assets</b>. <b>Net working capital</b> is the <b>excess of current assets over current liabilities</b> (NWC = CA - CL), i.e. that portion of current assets financed out of <b>long-term sources</b>.",
      q: "An answer that says only \"investment in current assets\" has defined <b>gross</b> working capital. Net working capital can be <b>negative</b> when current liabilities exceed current assets - a warning sign on liquidity."
    },
    'operating-cycle': {
      term: "Operating Cycle",
      def: "The operating cycle (working capital cycle) is the <b>time taken to convert cash into raw material, raw material into finished goods, finished goods into sales or debtors, and debtors back into cash</b>. The <b>longer the operating cycle, the greater the working capital required</b>.",
      q: "This is why a <b>manufacturing</b> firm needs far more working capital than a <b>trading</b> firm - a trader has <b>no production cycle</b>, so goods can be resold as soon as they are bought."
    },
    'floatation-cost': {
      term: "Floatation Cost",
      def: "Floatation cost is the <b>cost of raising funds</b> from a particular source - for instance the underwriting commission, brokerage, advertising and legal expenses of a <b>public issue of shares or debentures</b>. The <b>higher the floatation cost, the less attractive</b> that source becomes.",
      q: "A factor affecting both the <b>financing decision</b> and the <b>capital structure</b>. A loan from a financial institution normally carries a much lower floatation cost than a public issue, which is why smaller firms prefer it."
    },
    'cost-of-debt': {
      term: "Cost of Debt",
      def: "Cost of debt is the <b>rate of interest</b> that a firm pays on its borrowed funds. Debt is the <b>cheapest source</b> of finance because interest is a <b>tax-deductible expense</b> and lenders bear less risk than shareholders.",
      q: "Cheap does not mean safe - every rupee of debt creates a <b>fixed obligation</b> and therefore raises <b>financial risk</b>. A firm can use more debt only if its <b>cash flow position and interest coverage ratio</b> are strong."
    },
    'cost-of-equity': {
      term: "Cost of Equity",
      def: "Cost of equity is the <b>rate of return that equity shareholders expect</b> from the company. It is <b>higher than the cost of debt</b> because equity shareholders bear the <b>greatest risk</b> and because dividend is <b>not a tax-deductible expense</b>.",
      q: "A frequent error is to treat equity as \"free\" because dividend is not compulsory. Equity has a real <b>opportunity cost</b>, and raising more equity than is needed <b>dilutes EPS</b>."
    },
    'debt-equity-ratio': {
      term: "Debt-Equity Ratio",
      def: "The debt-equity ratio is <b>Debt divided by Equity</b> - the measure of a company's <b>capital structure</b>. A higher ratio means greater reliance on <b>trading on equity</b> and correspondingly higher <b>financial risk</b>.",
      q: "Lenders and rating agencies watch this ratio; once a firm has used its <b>debt potential</b> to the full it loses <b>flexibility</b> to borrow in an emergency."
    },
    'financial-market': {
      term: "Financial Market",
      def: "A financial market is a market for the <b>creation and exchange of financial assets</b>. It <b>channelises savings from surplus units (households) to deficit units (business firms)</b> which need them for investment.",
      q: "Its four functions are <b>mobilisation of savings, price determination, providing liquidity to financial assets, and reducing the cost of transactions</b>. The alternative is <b>direct financing</b>, which is far costlier in search and information."
    },
    'allocative-function': {
      term: "Allocative Function",
      def: "The allocative function of a financial market is the <b>allocation of scarce savings among competing users of funds</b>, so that funds flow to the <b>most productive</b> investment. Performing it well raises both the <b>rate of return to savers</b> and the <b>rate of growth of the economy</b>.",
      q: "A market that allocates badly injures both sides at once - savers earn less than they could, and genuinely productive firms are starved of capital."
    },
    'money-market': {
      term: "Money Market",
      def: "The money market is the market for <b>short-term funds</b>, dealing in instruments with a maturity of <b>up to one year</b>. It is a market for <b>low-risk, highly liquid, unsecured, short-term debt</b> instruments, and it is largely a <b>wholesale</b> market whose main players are the <b>RBI, commercial banks and large financial institutions</b>.",
      q: "Not the same as the capital market: money market = <b>short-term (up to one year), debt only, low risk, low return, high liquidity, wholesale</b>; capital market = <b>medium and long-term, debt and equity, higher risk, higher return, retail and institutional</b>."
    },
    'capital-market': {
      term: "Capital Market",
      def: "The capital market is the market for <b>medium and long-term funds</b>, dealing in both <b>debt and equity</b> instruments such as shares, debentures and bonds. It has two segments - the <b>primary market</b> and the <b>secondary market</b>.",
      q: "Money market instruments mature within a year and are traded <b>over the counter</b>; capital market instruments are <b>long-term</b> and, once issued, are traded on a <b>stock exchange</b>."
    },
    'primary-market': {
      term: "Primary Market",
      def: "The primary market, also called the <b>new issues market</b>, is the market in which a company issues <b>fresh securities for the first time</b> in order to raise funds. The money raised goes <b>directly to the company</b>, and the transaction is between the <b>company and the investor</b>.",
      q: "Not the same as the secondary market: here <b>new</b> securities are created and the <b>company</b> receives the money; in the secondary market <b>existing</b> securities merely change hands between <b>investors</b> and the company receives nothing."
    },
    'secondary-market': {
      term: "Secondary Market",
      def: "The secondary market, also called the <b>stock exchange</b>, is the market in which <b>existing and already-issued securities are bought and sold between investors</b>. It provides <b>liquidity and marketability</b> to securities and continuously <b>determines their price</b>; the issuing company is not a party to the transaction.",
      q: "The two are interdependent - a security must first be <b>created in the primary market</b> before it can be traded, and investors subscribe to new issues only because the secondary market gives them an <b>exit</b>."
    },
    'treasury-bill': {
      term: "Treasury Bill (T-Bill)",
      def: "A Treasury Bill is a <b>short-term promissory note issued by the Reserve Bank of India on behalf of the Government of India</b>. It is issued at a <b>discount and redeemed at par</b>, the difference being the investor's return, and is therefore also called a <b>Zero Coupon Bond</b>. Its maturity is <b>91, 182 or 364 days</b>.",
      q: "A T-bill carries <b>no interest coupon</b> - the gain is the discount. It is the <b>safest</b> money market instrument because it carries a sovereign guarantee, and is issued in a minimum lot of <b>₹25,000</b>."
    },
    'commercial-paper': {
      term: "Commercial Paper",
      def: "Commercial Paper is a <b>short-term, unsecured promissory note issued by large and creditworthy companies</b> to raise funds. It is <b>negotiable, freely transferable and issued at a discount</b>, with a maturity ranging from <b>15 days to one year</b>.",
      q: "It is typically used as <b>bridge financing</b> - to meet the floatation costs of a forthcoming long-term issue. Unlike a commercial bill, it arises out of <b>no underlying trade transaction</b>."
    },
    'call-money': {
      term: "Call Money",
      def: "Call money is <b>short-term finance repayable on demand</b>, with a maturity of <b>one day to fifteen days</b>. It is used mainly by <b>banks borrowing from one another to meet the Cash Reserve Ratio (CRR)</b> requirement, and the interest paid on it is called the <b>call rate</b>.",
      q: "An <b>interbank</b> instrument. The call rate is <b>highly volatile</b> and moves <b>inversely</b> with the price of other short-term money market instruments."
    },
    'certificate-of-deposit': {
      term: "Certificate of Deposit",
      def: "A Certificate of Deposit is an <b>unsecured, negotiable, short-term instrument issued by commercial banks and development financial institutions</b> to depositors. It is issued during periods of <b>tight liquidity</b>, when deposit growth is slow but the demand for credit is high.",
      q: "Issued <b>by a bank to a depositor</b>. Contrast <b>commercial paper</b>, which is issued <b>by a company</b> to an investor."
    },
    'commercial-bill': {
      term: "Commercial Bill (Trade Bill)",
      def: "A commercial bill is a <b>bill of exchange drawn by a seller on a buyer</b> for the value of goods sold on credit. If the seller needs funds before the bill matures, it can be <b>discounted with a commercial bank</b>; when it is <b>accepted by a bank</b> it becomes a commercial bill of the highest quality.",
      q: "Unlike commercial paper, a commercial bill always arises out of a <b>genuine trade transaction</b>, which is why it is regarded as self-liquidating."
    },
    'stock-exchange': {
      term: "Stock Exchange",
      def: "A stock exchange is an <b>organised institution or market where securities that have already been issued are bought and sold</b> under prescribed rules and regulations. Its main functions are <b>providing liquidity and marketability to existing securities, pricing of securities, safety of transactions, contributing to economic growth, spreading the equity cult, and providing scope for healthy speculation</b>.",
      q: "A stock exchange deals only in <b>listed</b> securities and only in the <b>secondary</b> market. A company raising fresh capital does so in the <b>primary</b> market - not on the exchange."
    },
    'offer-through-prospectus': {
      term: "Offer through Prospectus",
      def: "Offer through prospectus is the most common method of floatation, in which the company makes a <b>direct appeal to the general public to subscribe to its securities through a prospectus</b>. The prospectus must be <b>advertised in at least two newspapers</b> and must satisfy SEBI's disclosure requirements.",
      q: "Also called a <b>public issue</b>. Contrast <b>offer for sale</b>, where the company does not approach the public at all but sells the whole issue to intermediaries."
    },
    'offer-for-sale': {
      term: "Offer for Sale",
      def: "Under offer for sale, securities are <b>not issued directly to the public but are sold in a block to intermediaries such as issue houses or stock brokers</b>, who then <b>resell them to the investing public at a higher price</b>.",
      q: "The company is <b>saved the formalities, time and cost</b> of a public issue, but the profit made on resale accrues to the <b>intermediary</b>, not to the company."
    },
    'private-placement': {
      term: "Private Placement",
      def: "Private placement is the <b>allotment of securities by a company to institutional investors and to some selected individuals</b>, rather than to the general public. It saves the company the <b>floatation costs, time and formalities</b> of a public issue.",
      q: "A public issue is open to <b>everyone</b>; a private placement is confined to a <b>selected few</b>. New and small companies that cannot afford a public issue commonly use this route."
    },
    'rights-issue': {
      term: "Rights Issue",
      def: "A rights issue is the <b>offer of new shares by an existing company to its existing shareholders in proportion to the shares they already hold</b>. It is a <b>pre-emptive right</b> of the existing shareholder, and the shares must be offered to him before they can be offered to the public.",
      q: "Not a bonus issue: a rights issue is a <b>paid</b> offer at a stated price which protects the existing shareholder's <b>proportion of ownership</b>, whereas a bonus issue is a <b>free</b> capitalisation of reserves."
    },
    'e-ipo': {
      term: "e-IPO",
      def: "An e-IPO is the issue of securities to the public through the <b>on-line system of a stock exchange</b>. The company must appoint <b>brokers registered with the stock exchange</b> to accept applications and a <b>registrar to the issue</b> having electronic connectivity with the exchange.",
      q: "The company must also apply for <b>listing</b> of the securities on <b>at least one stock exchange</b> other than the exchange through which it makes the offer."
    },
    'trading-procedure': {
      term: "Trading Procedure on a Stock Exchange",
      def: "The steps are: <b>(1) select a broker</b>; <b>(2) open a demat account and a trading account</b>; <b>(3) place the order</b> and obtain an order confirmation slip; <b>(4) the broker executes the order</b> on the exchange and issues a <b>contract note</b>; <b>(5) settlement</b> - securities and funds are exchanged through the depository and the clearing house.",
      q: "The <b>contract note</b> is the <b>legal document</b> that proves the trade and is essential in any dispute - it carries the trade time, price, brokerage and the broker's SEBI registration number."
    },
    'dematerialisation': {
      term: "Dematerialisation",
      def: "Dematerialisation is the process by which <b>physical share certificates are converted into an equivalent number of securities in electronic form and credited to the investor's demat account</b>. It is <b>compulsory</b> for trading on a stock exchange in India and eliminates the risks of theft, forgery and bad delivery.",
      q: "The reverse process, converting electronic holdings back into physical certificates, is called <b>rematerialisation</b>."
    },
    'demat-account': {
      term: "Demat Account",
      def: "A demat account is the account in which an investor's <b>securities are held in electronic form</b> with a depository, opened and operated through a <b>Depository Participant</b>. Securities bought are <b>credited</b> to it and securities sold are <b>debited</b> from it.",
      q: "Not the same as a <b>trading account</b> (opened with the broker, used to place buy and sell orders) or a <b>bank account</b> (which holds the money). All three are needed to trade."
    },
    'depository': {
      term: "Depository",
      def: "A depository is an <b>institution that holds the securities of investors in electronic form</b> and effects their transfer by <b>book entry</b>. India has two depositories - <b>NSDL</b> (National Securities Depository Limited) and <b>CDSL</b> (Central Depository Services Limited).",
      q: "A depository is a <b>bank for securities</b>. It does not deal with investors directly - an investor reaches it only through a <b>Depository Participant</b>."
    },
    'depository-participant': {
      term: "Depository Participant (DP)",
      def: "A Depository Participant is an <b>agent of the depository</b> - a bank, broker or financial institution registered with SEBI - through which an <b>investor opens and operates his demat account</b>.",
      q: "The <b>depository</b> is the institution that actually holds the securities; the <b>DP</b> is the intermediary the investor deals with, exactly as a branch is the interface to a bank."
    },
    'rolling-settlement': {
      term: "Rolling Settlement (T+1)",
      def: "Rolling settlement means that <b>every trading day is a separate settlement day</b>, and a trade is settled a fixed number of days after it is executed. India follows a <b>T+1 cycle</b> - a trade executed on day T is settled on the <b>next working day</b>.",
      q: "<b>Current practice, not the old textbook figure.</b> Older books show T+2 (and earlier T+5); India completed the phased move to <b>T+1 on 27 January 2023</b>, becoming the <b>second market in the world to do so, after China</b>. SEBI has since added an <b>optional same-day (T+0)</b> cycle, extended to the <b>top 500 stocks in phases from 31 January 2025</b>. Write <b>T+1</b> in the board paper."
    },
    'sebi': {
      term: "SEBI",
      def: "The Securities and Exchange Board of India was established in <b>1988</b> and given <b>statutory status in 1992</b>. Its purpose is to <b>protect the interests of investors, promote the development of the securities market, and regulate the securities market</b>.",
      q: "Name the <b>category</b> in the answer - SEBI's functions are <b>protective</b> (checking insider trading, price rigging and unfair trade practices), <b>developmental</b> (investor education, training of intermediaries, IPO through brokers) and <b>regulatory</b> (registering brokers and intermediaries, framing rules, conducting inquiries and audits)."
    },
    'speculation': {
      term: "Speculation",
      def: "Speculation is the <b>buying and selling of securities in the hope of profiting from short-term movements in their price</b>, rather than for long-term investment. A <b>reasonable degree of healthy speculation is necessary</b> on a stock exchange to provide <b>liquidity and continuous price adjustment</b>.",
      q: "Not the same as investment: an <b>investor</b> buys for long-term returns such as dividend and capital growth, a <b>speculator</b> for a short-term price difference. Excessive speculation is harmful and is curbed by <b>SEBI</b>."
    },
    'marketing': {
      term: "Marketing",
      def: "Marketing is a <b>social process by which individuals and groups obtain what they need and want through creating, offering and freely exchanging products and services of value with others</b>. Its focus is on <b>identifying and satisfying the needs and wants of the customer</b>, and earning profit through that satisfaction.",
      q: "Not the same as selling: marketing is the <b>whole set of activities</b> - identifying the need, designing the product, pricing, distributing, promoting and servicing - of which <b>selling is only one part</b>. Marketing begins <b>before</b> production and continues <b>after</b> the sale."
    },
    'selling': {
      term: "Selling",
      def: "Selling is that part of marketing which is concerned with the <b>transfer of ownership of a product from the seller to the buyer for a price</b>. It is <b>product-oriented</b> and seeks to convert the product into cash by <b>maximising sales volume</b>.",
      q: "Marketing starts <b>before production</b> with the customer's need and aims at <b>profit through customer satisfaction</b>; selling starts <b>after the product is produced</b> and aims at <b>profit through sales volume</b>. Selling is a <b>part</b> of marketing, never a synonym for it."
    },
    'marketing-management': {
      term: "Marketing Management",
      def: "Marketing management is the <b>art and science of choosing target markets and getting, keeping and growing customers</b> through <b>creating, delivering and communicating superior customer value</b>. In short, it is the <b>management of the marketing function</b> - planning, organising, directing and controlling all marketing activities.",
      q: "Marketing is the <b>process</b>; marketing management is the <b>managerial task</b> of directing that process towards the firm's objectives."
    },
    'production-concept': {
      term: "The Production Concept",
      def: "The production concept holds that <b>consumers will favour those products which are widely available and affordable</b>, so profit can be maximised through <b>large-scale production at a low average cost</b>. Its focus is on the <b>quantity of production</b>; its means is <b>availability and affordability</b>; its end is <b>profit through volume of production</b>.",
      q: "Do not fuse it with the <b>product</b> concept: production = <b>quantity, availability and low price</b>; product = <b>quality, features and performance</b>. This was the earliest philosophy, of the period when demand exceeded supply."
    },
    'product-concept': {
      term: "The Product Concept",
      def: "The product concept holds that <b>consumers will favour products of superior quality, performance and features</b>, so the firm should devote itself to <b>continuously improving the product</b>. Its focus is on the <b>quality of the product</b>; its end is <b>profit through product quality</b>.",
      q: "Its weakness is <b>marketing myopia</b> - the firm falls in love with its own product and loses sight of the customer's underlying need. A better mousetrap will not sell itself if the customer would rather have a chemical spray."
    },
    'selling-concept': {
      term: "The Selling Concept",
      def: "The selling concept holds that <b>customers will not buy enough of a firm's products unless they are aggressively persuaded to do so</b>, and that the firm must therefore undertake <b>aggressive selling and promotional efforts</b>. Its focus is on <b>existing products</b>; its end is <b>profit through sales volume</b>.",
      q: "Best suited to <b>unsought goods</b> such as insurance. Its danger is the <b>one-time sale</b> - a dissatisfied customer never returns, because the product was never designed around the need in the first place."
    },
    'marketing-concept': {
      term: "The Marketing Concept",
      def: "The marketing concept holds that the firm's task is to <b>determine the needs and wants of the target market and deliver the desired satisfaction more effectively and efficiently than the competitors</b>. Its focus is on <b>customer needs</b>; its end is <b>profit through customer satisfaction</b>.",
      q: "The exact reversal of the selling concept: selling asks how to sell what has already been made, marketing asks <b>what should be made</b>. The starting point is the <b>customer</b>, not the factory."
    },
    'societal-marketing-concept': {
      term: "The Societal Marketing Concept",
      def: "The societal marketing concept holds that the firm should identify the needs and wants of the target market and deliver the desired satisfaction <b>in a way that also preserves or enhances the long-term well-being of the consumer and of society</b>. Its focus is on <b>customer needs plus social welfare</b>; its end is <b>profit through customer satisfaction and social welfare</b>.",
      q: "An <b>extension</b> of the marketing concept, not a rejection of it. It answers the problems the marketing concept ignores - <b>pollution, deforestation, shortage of resources, population explosion and inflation</b> - so a firm that satisfies a want at the cost of society is not practising it."
    },
    'standardisation': {
      term: "Standardisation",
      def: "Standardisation refers to <b>producing goods of predetermined specifications</b>, which helps in achieving <b>uniformity and consistency</b> in the output. It assures buyers that the goods conform to a set standard of <b>quality, price and packaging</b>, and <b>reduces the need for inspection, testing and evaluation</b>.",
      q: "Not the same as grading: standardisation <b>fixes the specification before production</b> and applies to manufactured goods; grading <b>sorts goods after they exist</b> and applies mainly to produce that cannot be made to a specification."
    },
    'grading': {
      term: "Grading",
      def: "Grading is the process of <b>classification of products into different groups on the basis of some of their important characteristics such as quality and size</b>. It is necessary for products which are <b>not produced to predetermined specifications</b>, such as agricultural produce, and it helps in <b>realising a higher price for higher quality output</b>.",
      q: "Wheat, oranges and cotton are <b>graded</b>; a car or a soap is <b>standardised</b>. Both are <b>functions of marketing</b>, and the pair is a standing \"distinguish between\" question."
    },
    'marketing-mix': {
      term: "Marketing Mix",
      def: "Marketing mix refers to the <b>set of marketing tools that a firm uses to pursue its marketing objectives in the target market</b>. It consists of the <b>four Ps - Product, Price, Place (physical distribution) and Promotion</b>.",
      q: "Only <b>Price</b> generates <b>revenue</b>; the other three Ps are all <b>costs</b>. The elements are interdependent - a change in one usually forces a change in the others."
    },
    'branding': {
      term: "Branding",
      def: "Branding is the process of <b>giving a name, term, sign, symbol or design, or some combination of them, to a product</b> so as to <b>identify it and to differentiate it from the products of competitors</b>.",
      q: "Keep the three apart: <b>branding</b> gives the product an <b>identity</b> (Tata Salt); <b>packaging</b> designs the <b>container or wrapper</b> that protects and carries it; <b>labelling</b> designs the <b>slip of information carried on the package</b> - weight, ingredients, price, batch and expiry date."
    },
    'brand': {
      term: "Brand",
      def: "A brand is a <b>name, term, sign, symbol or design, or some combination of them, used to identify the products - goods or services - of one seller or group of sellers and to differentiate them from those of the competitors</b>. It has two components: the <b>brand name</b> and the <b>brand mark</b>.",
      q: "A good brand name should be <b>short, easy to pronounce, spell and remember</b>, should <b>suggest the product's benefit</b>, should be <b>distinctive</b>, and should be <b>capable of being registered and legally protected</b>."
    },
    'brand-name': {
      term: "Brand Name",
      def: "A brand name is <b>that part of a brand which can be spoken</b> - the <b>verbal component</b> of a brand. Examples are Amul, Bata, Asian Paints and Parker.",
      q: "A brand name is <b>utterable</b>; a <b>brand mark</b> is <b>recognisable but not utterable</b>. Together the two make up the <b>brand</b>."
    },
    'brand-mark': {
      term: "Brand Mark",
      def: "A brand mark is <b>that part of a brand which can be recognised but which is not utterable</b>. It appears in the form of a <b>symbol, design, distinct colour scheme or lettering</b> - for example the Amul girl or the Air India Maharaja.",
      q: "If you can <b>say</b> it aloud it is a <b>brand name</b>; if you can only <b>see</b> it, it is a <b>brand mark</b>."
    },
    'trademark': {
      term: "Trademark",
      def: "A trademark is <b>a brand or a part of a brand that is given legal protection</b>. The firm that gets its brand registered acquires the <b>exclusive right to use it</b>, and no other firm in the country may use that name or mark.",
      q: "Every trademark is a brand, but a brand becomes a trademark <b>only when it is registered</b>. The keyword the examiner is looking for is <b>legal protection</b>."
    },
    'labelling': {
      term: "Labelling",
      def: "Labelling refers to <b>designing and developing the label to be put on the package</b>. The label may range from <b>a simple tag to complex graphics</b>, and it serves to <b>describe the product and specify its contents, identify the product and the brand, grade the product, help in promotion, and provide the information required by law</b>.",
      q: "The label sits <b>on</b> the package - it is not the package itself. The MRP, net weight, batch number, expiry date and the statutory warning are <b>labelling</b>, not packaging."
    },
    'packaging': {
      term: "Packaging",
      def: "Packaging refers to the <b>act of designing and producing the container or wrapper of a product</b>. Its functions are <b>product identification, product protection, convenience in handling and use, and product promotion</b> - which is why the package is called a <b>silent salesman</b>.",
      q: "Keep the trio apart: <b>branding</b> gives the product an <b>identity</b> (Tata Salt); <b>packaging</b> is the <b>container or wrapper itself</b>; <b>labelling</b> is the <b>information slip carried on that package</b> - MRP, net weight, ingredients, batch number, expiry date, statutory warning. Packaging has three levels - <b>primary</b> (the immediate container, e.g. the toothpaste tube), <b>secondary</b> (the carton that protects it) and <b>transportation</b> packaging (the corrugated box used for shipping)."
    },
    'price': {
      term: "Price",
      def: "Price is the <b>amount of money paid by a customer to obtain a product</b>, that is, the <b>value of a product expressed in money terms</b>. It is the <b>only element of the marketing mix that generates revenue</b>; the other three Ps are costs.",
      q: "The factors determining price are <b>product cost, the utility of and demand for the product, the extent of competition in the market, government and legal regulations, pricing objectives, and the marketing methods used</b>. Product cost sets the <b>floor</b> and utility and demand set the <b>ceiling</b>."
    },
    'physical-distribution': {
      term: "Physical Distribution",
      def: "Physical distribution, the <b>Place</b> element of the marketing mix, covers <b>all the activities required to physically move goods from the manufacturer to the customer</b>, so that they are available at the <b>right place, at the right time and in the right quantity</b>. Its main components are <b>order processing, transportation, warehousing (storage) and inventory control</b>.",
      q: "Physical distribution is the <b>movement and storage</b> of the goods; a <b>channel of distribution</b> is the <b>set of intermediaries</b> through whom ownership passes. Both belong to \"Place\", but they are not the same thing. Warehousing creates <b>time utility</b>, transportation creates <b>place utility</b>."
    },
    'channels-of-distribution': {
      term: "Channels of Distribution",
      def: "A channel of distribution is the <b>set of firms and individuals that take title, or assist in transferring title, to a product as it moves from the producer to the consumer</b>. There are four levels: <b>zero level</b> (Manufacturer to Consumer - direct selling); <b>one level</b> (Manufacturer to Retailer to Consumer); <b>two level</b> (Manufacturer to Wholesaler to Retailer to Consumer, the commonest for consumer goods); and <b>three level</b> (Manufacturer to Agent to Wholesaler to Retailer to Consumer).",
      q: "Count <b>only the intermediaries between the manufacturer and the consumer</b> - the manufacturer and the consumer themselves are never counted. <b>Zero level</b> covers company showrooms, mail order, internet selling and door-to-door selling."
    },
    'promotion': {
      term: "Promotion",
      def: "Promotion refers to the <b>use of communication with the twin objective of informing potential customers about a product and persuading them to buy it</b>. It is the fourth P of the marketing mix, and the tools used together form the <b>promotion mix</b>.",
      q: "Promotion <b>informs and persuades</b>; it does not by itself transfer ownership. Do not equate promotion with advertising - advertising is only <b>one</b> of its four elements."
    },
    'promotion-mix': {
      term: "Promotion Mix",
      def: "Promotion mix refers to the <b>combination of promotional tools used by an organisation to achieve its communication objectives</b>. Its four elements are <b>Advertising, Personal Selling, Sales Promotion and Public Relations (Publicity)</b>.",
      q: "The combination chosen depends on the <b>nature of the product, the nature of the market, the promotion budget and the objectives of promotion</b> - consumer goods firms rely on <b>advertising</b>, industrial goods firms on <b>personal selling</b>."
    },
    'advertising': {
      term: "Advertising",
      def: "Advertising is a <b>paid form of impersonal presentation and promotion of goods and services by an identified sponsor</b>. Its three features are that it is <b>paid for</b>, it is <b>impersonal</b> (no face-to-face contact and no immediate feedback), and it carries an <b>identified sponsor</b>.",
      q: "Distinguish the three tools by <b>form and cost</b>: advertising is <b>impersonal, paid, mass reach, low cost per person</b>; <b>personal selling</b> is <b>personal, two-way, highest cost per contact</b>; <b>sales promotion</b> is a <b>short-term incentive</b> used to boost immediate sales."
    },
    'personal-selling': {
      term: "Personal Selling",
      def: "Personal selling involves the <b>oral presentation of a message in the form of a conversation with one or more prospective customers for the purpose of making a sale</b>. Its features are <b>personal form, development of relationship, and building of customer confidence</b>.",
      q: "It is the only promotional tool that is <b>two-way</b> - the salesperson receives <b>immediate feedback</b> and can adapt the message on the spot. It is the most <b>flexible</b> tool but also the <b>costliest per contact</b>."
    },
    'sales-promotion': {
      term: "Sales Promotion",
      def: "Sales promotion refers to <b>short-term incentives designed to encourage the purchase or sale of a product or service</b>. Common techniques are <b>rebate, discount, refunds, product combinations, quantity gift, instant draws and assured gifts, lucky draw, usable benefit, full finance at zero per cent, sampling and contests</b>.",
      q: "The phrase the examiner wants is <b>short-term incentive</b>. Sales promotion produces a <b>quick but temporary</b> rise in sales; used too often it <b>damages the brand image</b> and trains customers to wait for the next offer."
    },
    'public-relations': {
      term: "Public Relations",
      def: "Public relations involves a <b>variety of programmes designed to promote or protect a company's image and its products in the eyes of all its publics</b> - the press, customers, employees, suppliers, shareholders, the government and the general public.",
      q: "Not the same as publicity: <b>publicity</b> is <b>unpaid, non-personal news coverage</b> of the firm and is only <b>one tool</b> of public relations, whereas public relations is the <b>continuing programme</b> of managing the firm's image."
    },
    'consumer': {
      term: "Consumer (under the Act)",
      def: "Under the <b>Consumer Protection Act, 2019</b>, a consumer is a person who <b>buys any goods or avails any service for a consideration</b> which has been <b>paid or promised, or partly paid and partly promised, or under any system of deferred payment</b>. It includes <b>any user of such goods or beneficiary of such services</b> when used with the <b>approval of the buyer</b>, and it covers <b>online, teleshopping, direct selling and multi-level marketing</b> transactions.",
      q: "A person who obtains goods or avails services for <b>resale or for any commercial purpose</b> is <b>not</b> a consumer. Exception: goods bought or services availed <b>exclusively for earning a livelihood by means of self-employment</b> are covered."
    },
    'consumer-protection': {
      term: "Consumer Protection",
      def: "Consumer protection means <b>safeguarding the interests and rights of consumers against unfair trade practices and exploitation</b> by sellers - defective goods, deficient services, adulteration, false and misleading advertisements, hoarding, black marketing and overcharging.",
      q: "Argue its importance from <b>both sides</b>: from the <b>consumer's</b> point of view (ignorance, unorganised consumers, widespread exploitation) and from the <b>business</b> point of view (long-term interest of business, business uses society's resources, social responsibility, moral justification, government intervention)."
    },
    'consumer-protection-act-2019': {
      term: "The Consumer Protection Act, 2019",
      def: "The Consumer Protection Act, <b>2019</b> - which <b>replaced the Consumer Protection Act, 1986</b> - seeks to <b>protect and promote the interests of consumers through speedy and inexpensive redressal of their grievances</b>. It extends to the whole of India, applies to all goods and services including <b>e-commerce</b>, and introduced the <b>CCPA, product liability, mediation and e-filing</b>.",
      q: "<b>Do not quote the 1986 Act.</b> The redressal bodies are now called <b>Commissions</b>, not Forums, and the pecuniary limits were revised again by the <b>Consumer Protection (Jurisdiction) Rules, 2021</b>."
    },
    'defect': {
      term: "Defect",
      def: "Under the <b>Consumer Protection Act, 2019</b>, defect means <b>any fault, imperfection or shortcoming in the quality, quantity, potency, purity or standard</b> which is required to be maintained <b>by or under any law</b>, or <b>under any contract, express or implied</b>, or <b>as is claimed by the trader in any manner whatsoever</b>, <b>in relation to any goods or product</b>.",
      q: "<b>Defect relates to goods; deficiency relates to services</b> - and the statute uses <b>different words</b> for each, which is where the mark is. Defect is measured against <b>quality, quantity, potency, purity or standard</b>; deficiency is measured against the <b>quality, nature and manner of performance</b> of a service. A new refrigerator that leaks is a <b>defect</b>; a courier that never delivered the parcel is a <b>deficiency</b>."
    },
    'deficiency': {
      term: "Deficiency",
      def: "Deficiency means <b>any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance in relation to any service</b>, and includes any <b>act of negligence, omission or commission, or the withholding of relevant information</b> which causes loss or injury to the consumer.",
      q: "The word applies to <b>services only</b>. Writing \"deficiency in goods\" in the paper loses the mark - use <b>defect</b> for goods."
    },
    'unfair-trade-practice': {
      term: "Unfair Trade Practice",
      def: "An unfair trade practice is a trade practice which, <b>for the purpose of promoting the sale, use or supply of any goods or service, falsely represents its quality, standard, quantity, composition, style or model</b>, or otherwise makes a false or misleading claim about it.",
      q: "Not the same as a <b>restrictive trade practice</b>, which <b>manipulates price or affects the flow of supplies</b> in the market so as to impose an <b>unjustified cost</b> on the consumer - for example hoarding, or insisting on a tie-in purchase."
    },
    'right-to-safety': {
      term: "Right to Safety",
      def: "The right to safety is the consumer's right <b>to be protected against goods and services which are hazardous to life, health and property</b>. Consumers should be assured of the <b>quality and safety</b> of the goods they buy - which is why quality marks such as <b>ISI, Agmark, Hallmark, FPO and Eco-mark</b> exist.",
      q: "Buying only <b>standardised goods carrying a quality mark</b> is the matching <b>responsibility</b> - the right is what the law owes the consumer, the responsibility is what the consumer must do."
    },
    'right-to-be-informed': {
      term: "Right to be Informed",
      def: "The right to be informed is the consumer's right <b>to have complete information about the product before buying it</b> - its <b>ingredients, quantity, quality, purity, standard, price, date of manufacture and date of expiry</b>. Indian law requires the manufacturer to provide this information on the <b>package and the label</b>.",
      q: "The right places the duty on the <b>seller to disclose</b>; the matching <b>responsibility</b> is on the consumer to <b>read the label carefully</b>. Examiners set the two against each other."
    },
    'right-to-choose': {
      term: "Right to Choose",
      def: "The right to choose is the consumer's right <b>to have access to a variety of products at competitive prices</b>, and to be <b>free to choose any product or service of his liking</b> without being pressurised by the seller.",
      q: "This right is defeated by <b>monopoly and by tie-in sales</b> - being told that a gas connection will be given only if the stove is bought from the same dealer is a clear violation of it."
    },
    'right-to-be-heard': {
      term: "Right to be Heard",
      def: "The right to be heard is the consumer's right <b>to file a complaint and to be heard in case of dissatisfaction</b> with a good or a service. Many firms have therefore set up <b>consumer grievance cells</b>, and consumer interests must be represented in <b>policy-making forums</b>.",
      q: "Not the same as the right to seek redressal: being <b>heard</b> is the right to have the complaint <b>received and considered</b>; <b>redressal</b> is the right to actually <b>obtain relief</b> - repair, replacement, refund or compensation."
    },
    'right-to-seek-redressal': {
      term: "Right to Seek Redressal",
      def: "The right to seek redressal is the consumer's right <b>to get relief against an unfair trade practice or unscrupulous exploitation</b>. Under the Act the Commission may order <b>removal of the defect, replacement of the product, refund of the price paid, or compensation</b> for the loss or injury suffered.",
      q: "Redressal is the <b>outcome</b>; the right to be heard is the <b>hearing</b> that precedes it. The matching <b>responsibility</b> is to <b>file a complaint for a genuine grievance</b> and to keep the <b>cash memo</b> as proof."
    },
    'right-to-consumer-education': {
      term: "Right to Consumer Education",
      def: "The right to consumer education is the consumer's right <b>to acquire knowledge and to be a well-informed consumer throughout life</b> - to know his rights and the reliefs available to him. The Government of India runs the <b>Jago Grahak Jago</b> campaign and a <b>national consumer helpline</b> for this purpose.",
      q: "It is listed last of the six rights but it is the one that makes the other five usable - a consumer who does not know a right exists cannot exercise it."
    },
    'consumer-responsibilities': {
      term: "Consumer Responsibilities",
      def: "Consumer responsibilities are the <b>duties the consumer must himself discharge for his rights to become effective</b> - be <b>aware</b> of the products available; buy only <b>standardised goods</b> bearing ISI, Agmark or Hallmark; <b>read the labels</b> carefully; <b>assert</b> himself and bargain; <b>ask for a cash memo</b>; <b>file a complaint</b> for a genuine grievance; and <b>form consumer societies</b>.",
      q: "A <b>right</b> is what the consumer can claim <b>from the seller and the law</b>; a <b>responsibility</b> is what the consumer <b>must do himself</b>. \"Right to be informed\" = the seller must tell you; \"read the label carefully\" = your responsibility. Board questions deliberately mix the two lists."
    },
    'who-can-file-a-complaint': {
      term: "Who Can File a Complaint",
      def: "Under the Consumer Protection Act, 2019 a complaint may be filed by: <b>any consumer</b>; <b>any registered voluntary consumer association</b>; the <b>Central Government or any State Government</b>; the <b>Central Authority (CCPA)</b>; <b>one or more consumers having the same interest</b>; the <b>legal heir or legal representative</b> of a deceased consumer; and the <b>parent or legal guardian</b> where the consumer is a minor.",
      q: "The complainant need <b>not be the buyer</b> - a <b>beneficiary</b> who used the goods or services with the buyer's approval, and a <b>legal heir</b>, may also file."
    },
    'district-commission': {
      term: "District Commission",
      def: "The District Commission is the <b>first tier</b> of the three-tier redressal machinery, set up by the State Government in each district. Under the <b>Consumer Protection (Jurisdiction) Rules, 2021 (in full, the Consumer Protection (Jurisdiction of the District Commission, the State Commission and the National Commission) Rules, 2021)</b> it entertains complaints where the value of the goods or services <b>paid as consideration does not exceed ₹50 lakh</b>. An appeal against its order lies to the <b>State Commission within 45 days</b>.",
      q: "<b>Use the 2021 figure, not the older one.</b> The 2019 Act as first enacted set this limit at ₹1 crore; the <b>2021 Rules reduced it to ₹50 lakh</b>. Note also that the limit is on the <b>consideration paid</b>, not on the compensation claimed."
    },
    'state-commission': {
      term: "State Commission",
      def: "The State Commission is the <b>second tier</b>, established by the State Government and ordinarily functioning at the state capital. Under the <b>Consumer Protection (Jurisdiction) Rules, 2021</b> it entertains complaints where the value of the goods or services paid as consideration <b>exceeds ₹50 lakh but does not exceed ₹2 crore</b>. An appeal against its order lies to the <b>National Commission within 30 days</b>.",
      q: "The State Commission has <b>both</b> original jurisdiction (complaints within its slab) <b>and</b> appellate jurisdiction (appeals from District Commissions). Older books show the slab as ₹1 crore to ₹10 crore - that figure is <b>superseded</b>."
    },
    'national-commission': {
      term: "National Commission",
      def: "The National Commission is the <b>apex tier</b>, set up by the Central Government, with territorial jurisdiction over the <b>whole of India</b>. Under the <b>Consumer Protection (Jurisdiction) Rules, 2021</b> it entertains complaints where the value of the goods or services paid as consideration <b>exceeds ₹2 crore</b>. An appeal against its order lies to the <b>Supreme Court of India within 30 days</b>.",
      q: "Note the appeal periods differ: District to State is <b>45 days</b>, State to National is <b>30 days</b>, National to Supreme Court is <b>30 days</b>."
    },
    'ccpa': {
      term: "Central Consumer Protection Authority (CCPA)",
      def: "The CCPA is the <b>central regulator established under the Consumer Protection Act, 2019</b> to regulate matters relating to <b>violation of consumer rights, unfair trade practices, and false or misleading advertisements</b> which are prejudicial to the interests of consumers as a class. It can <b>order recall of goods, order refund of the price, impose penalties, and ban misleading advertisements and penalise their endorsers</b>.",
      q: "A <b>new creation of the 2019 Act</b> - there was no such body under the 1986 Act. The CCPA acts <b>suo motu</b> for consumers <b>as a class</b>; the Commissions decide an <b>individual</b> complaint."
    },
    'product-liability': {
      term: "Product Liability",
      def: "Product liability is the <b>responsibility of a product manufacturer or product seller to compensate a consumer for any harm caused by a defective product manufactured or sold, or by a deficiency in the service rendered</b>.",
      q: "Another <b>new provision of the 2019 Act</b>. It shifts the burden onto the manufacturer or seller - the consumer need not prove negligence, only <b>harm caused by the defect or deficiency</b>."
    },
    'e-filing': {
      term: "E-filing of Complaints",
      def: "E-filing is the facility introduced by the <b>Consumer Protection Act, 2019</b> under which a consumer may <b>file a complaint electronically</b>, and may file it in the Commission having jurisdiction over the place where he <b>ordinarily resides or works</b>, rather than only where the opposite party carries on business.",
      q: "A change from the 1986 Act, meant to make redressal <b>cheaper and faster</b> and to bring <b>e-commerce</b> disputes within easy reach of the consumer."
    },
    'mediation': {
      term: "Mediation",
      def: "Mediation is the <b>alternative dispute resolution mechanism introduced by the Consumer Protection Act, 2019</b>. Where it appears to a Commission that there exist <b>elements of a settlement acceptable to both parties</b>, it may, with their <b>written consent</b>, refer the matter to a <b>Consumer Mediation Cell</b>; if the mediation fails, the Commission proceeds with the complaint.",
      q: "Mediation is <b>voluntary</b> - it requires the written consent of both parties given within five days - and there is <b>no appeal</b> against a settlement recorded through it."
    },
    'consumer-organisations': {
      term: "Consumer Organisations and NGOs",
      def: "Consumer organisations and NGOs protect and promote consumer interests by <b>educating consumers about their rights, publishing journals and booklets, carrying out comparative testing of products, encouraging consumers to protest against unfair trade practices, providing legal assistance, and filing complaints and public interest litigation on behalf of consumers</b>.",
      q: "Examples: the <b>Consumer Guidance Society of India (CGSI), Mumbai</b> and the <b>Voluntary Organisation in Interest of Consumer Education (VOICE), New Delhi</b>. A <b>registered voluntary consumer association</b> is itself entitled to file a complaint."
    },

    /* ---- Added during review — file these into the group above when you next touch them ---- */
    'product': {
      term: "Product (element of the marketing mix)",
      def: "In the marketing mix, a product is <b>anything of value that is offered to a market for attention, acquisition, use or consumption, and that is capable of satisfying a need or want</b>. It covers not only the physical good but the whole <b>bundle of utilities</b> the customer buys - its <b>quality, features, variety, brand name, packaging, labelling, warranty and after-sales service</b>.",
      q: "<b>Branding, labelling and packaging are decisions within the Product element</b>, not extra Ps. The four Ps are <b>Product, Price, Place and Promotion</b> - writing branding as a fifth P loses the mark. The customer buys a <b>benefit</b>, not an object: a person buying a refrigerator is buying <b>cold storage</b>."
    },
    'functions-of-marketing': {
      term: "Functions of Marketing",
      def: "The activities a firm performs to move a product from conception to satisfied customer: <b>gathering and analysing market information</b>, <b>marketing planning</b>, <b>product designing and development</b>, <b>standardisation and grading</b>, <b>packaging and labelling</b>, <b>branding</b>, <b>customer support services</b>, <b>pricing of products</b>, <b>promotion</b>, <b>physical distribution</b>, <b>transportation</b>, and <b>storage or warehousing</b>.",
      q: "A <b>function of marketing</b> is an activity the firm performs; an <b>element of the marketing mix</b> is a variable it controls. The function students most often omit is <b>customer support services</b> - after-sales service, handling customer complaints, technical services, consumer information and credit facilities - which is what produces <b>repeat purchase</b>. Points = marks: a 6-mark question wants six functions, each with a bolded heading."
    },
    'marketing-myopia': {
      term: "Marketing Myopia",
      def: "Marketing myopia is the <b>short-sightedness of a firm that concentrates on its existing product rather than on the customer need that product serves</b>, so that it fails to see a change in the need or a better way of meeting it. Theodore Levitt's example: the American railways declined because they defined themselves as being in the <b>railroad business rather than the transportation business</b>.",
      q: "Marketing myopia is the standing danger of the <b>product concept</b> and of the <b>selling concept</b> - the firm falls in love with what it makes. The <b>marketing concept</b> cures it by starting from the <b>customer's need</b> rather than the factory. A better mousetrap will not sell itself if the customer would rather have a chemical spray."
    },
    'fayol': {
      term: "Henri Fayol",
      def: "Henri Fayol (1841-1925) was a French mining engineer who rose to be the <b>Managing Director of a coal mining company</b> and is known as the <b>Father of General (Administrative) Management</b>. He looked at management <b>from the top downward</b>, from the standpoint of the enterprise as a whole, and gave the <b>fourteen principles of general management</b>, which are <b>universally applicable to every kind of organisation</b>.",
      q: "The single biggest trap in the paper. <b>Fayol</b> - top level, general administration, <b>fourteen principles</b>, arrived at by <b>personal experience and observation</b>, applicable to <b>all organisations</b>. <b>Taylor</b> - shop floor, factory production, <b>four principles plus his techniques</b>, arrived at by <b>observation and experimentation</b>, applicable mainly to <b>specialised production</b>. Fayol's work is called <b>principles of management</b>; Taylor's is called <b>scientific management</b>. Never file one man's item under the other's name."
    },
    'performance-appraisal': {
      term: "Performance Appraisal",
      def: "Performance appraisal means <b>evaluating an employee's current and past performance against a predetermined standard</b>, and communicating the result to him. It is the <b>sixth step of the staffing process</b>, and the basis on which <b>promotion, transfer, training needs and compensation</b> are decided.",
      q: "Not the same as a <b>selection test</b>: a selection test judges an <b>outside candidate before</b> he is hired; performance appraisal judges an <b>existing employee after</b> he has worked. Note the link to Chapter 8 - appraisal is <b>controlling applied to a person</b>: a standard is set, actual performance measured, and the deviation acted on."
    },
    'financial-leverage': {
      term: "Financial Leverage",
      def: "Financial leverage is the <b>proportion of debt in the overall capital structure</b> of a company. A company is said to be <b>highly levered</b> when the proportion of debt is high. Leverage is <b>favourable</b> when the <b>Rate of Return on Investment exceeds the rate of interest on debt</b>, and <b>unfavourable</b> when ROI falls below it.",
      q: "Financial leverage is the <b>cause</b>; <b>trading on equity</b> is the <b>effect</b> - the rise in <b>EPS</b> that favourable leverage produces. Every rupee of leverage also raises <b>financial risk</b>, so a capital structure is not better merely because it is more levered."
    },
    'earnings-per-share': {
      term: "Earnings Per Share (EPS)",
      def: "EPS is the <b>profit available to equity shareholders divided by the number of equity shares</b>. It is the standard measure used to test whether a change in the <b>capital structure</b> has actually benefited the equity shareholder.",
      q: "EPS is the number that proves or disproves <b>trading on equity</b>: it <b>rises</b> when ROI exceeds the cost of debt and <b>falls</b> when it does not. A higher EPS alone does not settle the question - the accompanying rise in <b>financial risk</b> must be weighed against it. Raising more equity than is needed <b>dilutes</b> EPS."
    },
    'gst': {
      term: "Goods and Services Tax (GST)",
      def: "GST, introduced on <b>1 July 2017</b>, is a <b>single destination-based indirect tax</b> which <b>replaced the earlier multiple central and state indirect taxes</b> - excise duty, service tax, VAT, CST and octroi. For business it changed both the <b>legal and the economic environment</b>: it created <b>one national market</b>, allowed <b>input tax credit across the whole chain</b>, and forced firms to redesign <b>pricing, supply chain and warehousing</b> decisions.",
      q: "<b>Date it on the slide.</b> GST (2017) and <b>demonetisation</b> (8 November 2016) are the two recent policy changes the paper uses; the <b>LPG reforms of 1991</b> are history and must be taught as history. GST is a <b>legal</b> change (a statute) with an <b>economic</b> consequence (cost and price) - if the question asks for one dimension, say which and why."
    },
    'restrictive-trade-practice': {
      term: "Restrictive Trade Practice",
      def: "Under the <b>Consumer Protection Act, 2019</b>, a restrictive trade practice is a trade practice which tends to bring about <b>manipulation of price or of the conditions of delivery, or to affect the flow of supplies in the market</b>, so as to impose on the consumer an <b>unjustified cost or restriction</b>. It includes <b>delay beyond the agreed period</b> in supplying goods or services, and <b>requiring the consumer to buy or hire some other goods as a condition precedent</b> (a tie-in sale).",
      q: "Not the same as an <b>unfair trade practice</b>: an unfair trade practice makes a <b>false or misleading claim</b> in order to promote a sale; a restrictive trade practice <b>manipulates price or supply</b> and forces an unjustified cost on the consumer. Advertising a cream as 'removes every wrinkle in seven days' is <b>unfair</b>; insisting that the gas stove be bought from the same dealer as the connection is <b>restrictive</b>."
    },
    'reliefs-available': {
      term: "Reliefs Available to the Consumer",
      def: "The reliefs a Consumer Commission may order under the <b>Consumer Protection Act, 2019</b>: <b>removal of the defect</b> in the goods or the <b>deficiency</b> in the service; <b>replacement</b> of the goods with new goods of similar description free from defect; <b>refund of the price</b> paid; <b>payment of compensation</b> for the loss or injury suffered; <b>discontinuance of the unfair or restrictive trade practice</b>; <b>withdrawal of hazardous goods from sale</b>; <b>issue of a corrective advertisement</b>; <b>payment of punitive damages</b>; and <b>payment of adequate costs</b> to the complainant.",
      q: "'What remedies are available to the consumer' wants <b>this</b> list, not the list of consumer <b>rights</b> - the commonest wrong answer in the chapter. <b>Points = marks</b>: a 5-mark question needs five reliefs, each named in the Act's own words and given its own bolded heading."
    }
  };

  // Build the panel markup for a glossary term.
  function glossPanel(key, id) {
    var g = GLOSSARY[key];
    var el = document.createElement('div');
    el.className = 'infopanel';
    el.id = id;
    el.innerHTML = '<span class="tag">Recall — ' + g.term + '</span><p>' + g.def + '</p>' +
                   (g.q ? '<div class="q">' + g.q + '</div>' : '');
    return el;
  }

  // Wire every <button class="info" data-term="…"> to a generated panel
  // placed at the end of its own slide (never inside a grid cell).
  function buildGlossary() {
    var n = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.info[data-term]'), function (btn) {
      var key = btn.getAttribute('data-term');
      var g = GLOSSARY[key];
      if (!g) { btn.remove(); return; }          // unknown term — fail quietly, never show a dead button
      var id = 'gloss-' + key + '-' + (++n);
      btn.setAttribute('aria-controls', id);
      btn.setAttribute('aria-expanded', 'false');
      if (!btn.getAttribute('title')) btn.setAttribute('title', 'What is ' + g.term + '?');
      btn.setAttribute('aria-label', 'Definition of ' + g.term);
      if (!btn.textContent.trim()) btn.textContent = 'i';
      var slide = btn.closest('.slide');
      (slide || btn.parentElement).appendChild(glossPanel(key, id));
    });
  }

  function reveals(s) { return Array.prototype.slice.call(s.querySelectorAll('.reveal')); }

  function paint() {
    slides.forEach(function (s, i) { s.classList.toggle('on', i === idx); });

    var cur = slides[idx], r = reveals(cur);
    r.forEach(function (el, i) { el.classList.toggle('shown', i < step); });

    // An .ephemeral item (e.g. "Are you ready for the answer?") disappears
    // once anything after it has been revealed.
    r.forEach(function (el, i) {
      if (el.classList.contains('ephemeral') && step > i + 1) el.classList.remove('shown');
    });

    // collapse any info panels belonging to other slides
    Array.prototype.forEach.call(document.querySelectorAll('.infopanel.open'), function (p) {
      if (!cur.contains(p)) p.classList.remove('open');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.info[aria-expanded="true"]'), function (b) {
      if (!cur.contains(b)) b.setAttribute('aria-expanded', 'false');
    });

    document.getElementById('counter').textContent = (idx + 1) + ' / ' + slides.length;
    document.getElementById('progress').style.width =
      (((idx + (r.length ? step / (r.length + 1) : 0)) / slides.length) * 100) + '%';
    document.getElementById('sect').textContent = cur.dataset.section || '';

    document.getElementById('prev').disabled = (idx === 0 && step === 0);
    document.getElementById('next').disabled = (idx === slides.length - 1 && step >= r.length);

    document.getElementById('stage').scrollTop = 0;
    history.replaceState(null, '', '#' + (idx + 1));
  }

  function next() {
    if (step < reveals(slides[idx]).length) { step++; }
    else if (idx < slides.length - 1) { idx++; step = 0; }
    else { return; }
    paint();
  }

  function prev() {
    if (step > 0) { step--; }
    else if (idx > 0) { idx--; step = reveals(slides[idx]).length; }
    else { return; }
    paint();
  }

  function go(i, showAll) {
    idx = Math.max(0, Math.min(slides.length - 1, i));
    step = showAll ? reveals(slides[idx]).length : 0;
    paint();
  }

  /* ---------- slide menu ---------- */
  function buildMenu() {
    var box = document.querySelector('#menu .mlist'), last = null, html = '';
    slides.forEach(function (s, i) {
      var sec = s.dataset.section || '';
      if (sec !== last) { html += '<div class="mgroup">' + sec + '</div>'; last = sec; }
      var h = s.querySelector('h1, h2');
      var t = h ? h.textContent.replace(/^\s*[\d.]+\s*/, '').trim() : 'Slide ' + (i + 1);
      html += '<a href="#" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span>' + t + '</span></a>';
    });
    box.innerHTML = html;
    box.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      e.preventDefault();
      document.getElementById('menu').classList.remove('on');
      go(+a.dataset.i, false);
    });
  }

  function toggleMenu() { document.getElementById('menu').classList.toggle('on'); }

  /* ---------- info buttons ---------- */
  // An "i" button reveals a panel explaining why a point is worded the way it is.
  // Independent of the arrow-key reveal system: click-only, teacher-triggered.
  function wireInfo() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.info');
      if (!btn) return;
      e.preventDefault();
      var id = btn.getAttribute('aria-controls');
      var panel = id ? document.getElementById(id) : null;
      if (!panel) {
        var host = btn.closest('h1,h2,h3,h4,p,li,div');
        panel = host && host.parentElement && host.parentElement.querySelector('.infopanel');
      }
      if (!panel) return;
      btn.setAttribute('aria-expanded', panel.classList.toggle('open') ? 'true' : 'false');
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
    if (!slides.length) return;

    // inherit section label from the previous slide when omitted
    var carry = '';
    slides.forEach(function (s) {
      if (s.dataset.section) carry = s.dataset.section; else s.dataset.section = carry;
    });

    buildGlossary();
    buildMenu();
    wireInfo();

    document.getElementById('next').addEventListener('click', next);
    document.getElementById('prev').addEventListener('click', prev);
    document.getElementById('menuBtn').addEventListener('click', toggleMenu);
    document.getElementById('fsBtn').addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    });

    document.addEventListener('keydown', function (e) {
      // let a focused info button handle its own Space/Enter instead of advancing
      if ((e.key === ' ' || e.key === 'Enter') &&
          e.target && e.target.closest && e.target.closest('.info')) return;
      if (e.key === 'Escape') { document.getElementById('menu').classList.remove('on'); return; }
      if (e.key === 'm' || e.key === 'M') { toggleMenu(); return; }
      if (e.key === 'f' || e.key === 'F') { document.getElementById('fsBtn').click(); return; }
      if (document.getElementById('menu').classList.contains('on')) return;

      switch (e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); next(); break;
        case 'ArrowLeft':  case 'PageUp':             e.preventDefault(); prev(); break;
        case 'Home': e.preventDefault(); go(0, false); break;
        case 'End':  e.preventDefault(); go(slides.length - 1, true); break;
      }
    });

    // touch swipe
    var x0 = null;
    document.getElementById('stage').addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    document.getElementById('stage').addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) { dx < 0 ? next() : prev(); }
      x0 = null;
    }, { passive: true });

    var start = parseInt((location.hash || '').replace('#', ''), 10);
    go(isNaN(start) ? 0 : start - 1, false);
  });
})();
