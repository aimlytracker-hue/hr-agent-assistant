// Fictional demonstration records; no real personnel data.
export const employees = [
 {id:'E001',name:'Aisha Rahman',department:'Operations',role:'Analyst',manager:'Daniel Tan',location:'Kuala Lumpur',employment:'Full time',pto:12,benefits:'Standard',remoteEligible:true},
 {id:'E002',name:'Daniel Tan',department:'Operations',role:'Team lead',manager:'Mira Lee',location:'Kuala Lumpur',employment:'Full time',pto:7,benefits:'Standard',remoteEligible:true},
 {id:'E003',name:'Priya Kumar',department:'Customer service',role:'Branch specialist',manager:'Daniel Tan',location:'Penang',employment:'Full time',pto:3,benefits:'Standard',remoteEligible:false}
];
export const topics = [
 ['PTO','Time off','pto leave holiday vacation annual sick balance carryover',[
 ['Annual leave','Full-time employees receive 20 days of annual leave per calendar year. New joiners receive a prorated allocation. The employee balance tool is the source for remaining days, not this annual entitlement.'],
 ['Request and approval','Submit annual leave at least 5 working days before the proposed start. A manager must review coverage and approve the request. A sufficient balance does not constitute approval. Requested days must be positive whole working days; weekends and public holidays are excluded.'],
 ['Carryover','Up to 5 unused annual leave days may carry into the next year and expire on 31 March. Exceptions require HR approval before expiry. The assistant cannot extend an expiry date.'],
 ['Sickness and emergencies','Notify your manager as soon as practical if you cannot attend work. HR will confirm the applicable sick leave allowance and documentation. Do not submit medical diagnoses through the assistant.'],
 ['Changes and cancellation','Ask the manager to cancel or amend approved leave before updating a balance. A pending HR ticket does not reserve days or reduce the employee balance. HR records the approved change in the system of record.']]],
 ['REMOTE','Remote work','remote hybrid home work location eligibility office abroad',[
 ['Eligibility','Remote work is available only for roles marked remoteEligible in the employee record. Customer-facing branch roles are not eligible under the standard arrangement. HR can review an exception, but the assistant cannot grant one.'],
 ['Standard arrangement','Eligible employees may request up to 2 remote working days per week. Manager approval is required for coverage and service needs. More than 2 days requires an HR exception review.'],
 ['Location and security','Standard remote work must be performed within Malaysia using an approved device and VPN. Overseas working requires separate HR, tax and security review before travel.'],
 ['Availability','Agree core collaboration hours and response expectations with your manager. Keep the team calendar current. A remote day remains a working day and must not be submitted as leave.'],
 ['Review and exceptions','Managers review arrangements every 90 days and may change them for service requirements. Record an exception rationale and proposed duration in an HR ticket. A ticket is a request for review, not an approval.']]],
 ['EXPENSE','Expenses','expense reimbursement receipt claim travel meal hotel myr cost',[
 ['Meals','Business meals may be reimbursed up to MYR 60 per person per day with an itemized receipt and business purpose. Amounts above this limit require manager exception approval. Personal meals are not reimbursable.'],
 ['Hotels','Domestic hotel accommodation has a standard cap of MYR 250 per night. Obtain approval before booking above the cap. An expense review is guidance and does not authorize payment.'],
 ['Evidence and deadline','Submit claims within 30 calendar days of the expense with itemized receipts, date, business purpose and cost centre. Missing evidence must be resolved with Finance. Do not upload payment card details.'],
 ['Travel approval','Obtain manager approval before business travel. Use standard economy fares and the approved booking channel. Personal itinerary extensions must be separated from the business claim.'],
 ['Review and duplicates','Finance validates receipts and duplicate claims before reimbursement. The assistant may prepare a review request but does not submit a claim to a payment system or approve reimbursement.']]],
 ['BENEFITS','Benefits','benefit insurance medical dental coverage enrollment dependent plan',[
 ['Standard plan','The synthetic Standard plan includes outpatient medical coverage up to MYR 2000 per year and dental coverage up to MYR 500 per year. These are plan limits, not remaining claim balances.'],
 ['Enrollment','Full-time employees may enroll during onboarding or the annual enrollment window. HR confirms the applicable dates and eligibility. The assistant does not enroll employees or change coverage.'],
 ['Dependents','Dependent coverage requires HR verification and plan administrator confirmation. Do not upload identity numbers or family medical details into this demonstration.'],
 ['Claims','Use the plan administrator channel for claims. For a rejected claim, provide a general issue summary and ask HR to review. Do not include diagnosis, treatment notes or account numbers.'],
 ['Changes and escalation','A qualifying life event may allow an enrollment change, subject to administrator review. Create an HR ticket for eligibility or coverage questions that the policy does not answer.']]],
 ['CONDUCT','Conduct','conduct harassment discrimination grievance conflict ethics retaliation',[
 ['Respectful workplace','Employees must act respectfully and must not discriminate or harass colleagues. Report concerns through the confidential HR reporting channel. Immediate safety threats require the appropriate emergency channel.'],
 ['Reporting','A report should describe the issue, timing and desired follow-up without unnecessary sensitive personal details. The assistant can draft a general referral but is not an investigation intake system.'],
 ['Confidentiality','HR limits access to case information to authorized reviewers with a business need. Do not promise absolute confidentiality or display another employee confidential records.'],
 ['Non retaliation','Retaliation for a good-faith concern is prohibited. HR reviews retaliation concerns independently. The assistant must not determine whether a complaint is substantiated.'],
 ['Conflicts of interest','Disclose potential conflicts to the manager and HR before participating in a decision. HR determines the mitigation and documents any recusal. The assistant cannot approve a conflict waiver.']]],
 ['SECURITY','Information security','security password vpn phishing device data privacy access',[
 ['Access control','Use individual approved accounts and multifactor authentication. Never share passwords, tokens or recovery codes. Access must be limited to the business need and reviewed when roles change.'],
 ['Devices and networks','Use approved devices and the corporate VPN when accessing protected resources remotely. Lock screens when unattended and install required security updates.'],
 ['Data handling','Do not paste real employee records, identity numbers, health information or credentials into this synthetic demonstration. Production HR data requires approved access controls, retention and privacy review.'],
 ['Incident reporting','Report suspected phishing, lost devices or unauthorized access immediately through the approved security incident channel. Do not investigate by opening suspicious attachments or sharing passwords.'],
 ['Records and retention','HR and Security set retention schedules for employee records and audit events. This demonstration stores only fictional HR requests. Production retention and deletion controls must be agreed before real-data use.']]]
];
export const policies=topics.flatMap(([code,category,keywords,sections],i)=>sections.map(([title,rule],j)=>({
 id:`${code}-${j+1}`,category,title,keywords,rule,page:i*5+j+1,version:'1.0',effective:'2026-11-01',
 text:`${rule}\n\nScope and responsibility\nThis is a fictional ${category.toLowerCase()} policy for the HR assistant demonstration. It applies to the mock employees in the supplied dataset. The employee initiates the request, the manager reviews operational impact, and HR or the relevant specialist confirms exceptions.\n\nProcedure\nRead this rule before making a request. Confirm the relevant employee record and provide only the facts needed for review. Where a rule depends on a balance, role, amount or document, verify that fact through the appropriate tool or responsible owner. If a fact is missing, request clarification.\n\nControl and escalation\nKeep policy evidence with the response using this page and section identifier. No assistant response grants approval, updates an official personnel record or commits funds. Route uncertain or exceptional cases to the accountable reviewer. A saved ticket documents a request only.\n\nExample and review\nAn employee asks about ${title.toLowerCase()}. The assistant retrieves this section, states the applicable rule and identifies missing information before preparing any follow-up. The reviewer checks the request against the cited version. HR owns changes to this demonstration rule; the effective date and version identify the material used.`
})));
