// Fictional demonstration records; no real personnel data.
import employeeRecords from '../../mock_data/employees.json' with {type:'json'};
import policyRecords from './generated/policies.json' with {type:'json'};
export const employees=employeeRecords;
export const policies=policyRecords;
export const topics=[...new Set(policies.map(p=>p.category))].map(category=>{const ps=policies.filter(p=>p.category===category);return [ps[0].id.split('-')[0],category,ps[0].keywords,ps.map(p=>[p.title,p.rule])];});
