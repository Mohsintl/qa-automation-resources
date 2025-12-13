import { useState } from 'react';
import { Copy, Check, FileText, AlertCircle, ClipboardList, Plus } from 'lucide-react';
import { submitContent } from '../utils/api';
import { SubmitTemplate } from './SubmitTemplate';
import { siteConfig } from '../config';

interface TemplatesProps {
  searchQuery: string;
}

const templates = [
  {
    id: 'bug-report',
    title: 'Bug Report Template',
    category: 'Bug Report',
    icon: <AlertCircle className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-red-500 to-rose-600',
    template: `## Bug Report

**Title:** [Brief description of the bug]

**Environment:**
- Browser/Device: [e.g., Chrome 120, iPhone 14]
- OS: [e.g., Windows 11, iOS 17]
- App Version: [e.g., v2.3.1]
- Environment: [Production/Staging/Dev]

**Severity:** [Critical/High/Medium/Low]
**Priority:** [P0/P1/P2/P3]

**Description:**
[Detailed description of what went wrong]

**Steps to Reproduce:**
1. Navigate to [URL/Screen]
2. Click on [Element]
3. Enter [Data]
4. Observe the issue

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots/Videos:**
[Attach relevant media]

**Additional Context:**
- Error messages: [If any]
- Console logs: [If applicable]
- Network requests: [If relevant]

**Reproducibility:**
- [ ] Always reproducible
- [ ] Intermittent
- [ ] Happened once

**Related Issues:** #[issue number]`
  },
  {
    id: 'triage-template',
    title: 'Bug Triage Template',
    category: 'Triage',
    icon: <ClipboardList className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-orange-500 to-amber-600',
    template: `## Bug Triage Assessment

**Bug ID:** #[number]
**Reported By:** [Name]
**Date Reported:** [Date]

**Triage Checklist:**
- [ ] Bug is reproducible
- [ ] Steps are clear and complete
- [ ] Severity is appropriate
- [ ] Priority is set correctly
- [ ] Assigned to correct team/person
- [ ] Labels added
- [ ] Sprint/Milestone assigned

**Impact Analysis:**
- Users Affected: [All/Some/Few/Single]
- Business Impact: [Revenue/Reputation/Functionality]
- Workaround Available: [Yes/No] - [Description if yes]

**Technical Assessment:**
- Root Cause: [If known]
- Areas Affected: [Frontend/Backend/Database/API]
- Risk Level: [High/Medium/Low]

**Recommended Actions:**
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

**Dependencies:**
[List any blockers or dependencies]

**Timeline Estimate:**
[Time to fix: Hours/Days/Weeks]

**Decision:**
- [ ] Approve for current sprint
- [ ] Move to backlog
- [ ] Needs more information
- [ ] Won't fix (with reason)`
  },
  {
    id: 'test-plan',
    title: 'Test Plan Template',
    category: 'Planning',
    icon: <FileText className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    template: `## Test Plan

**Feature:** [Feature Name]
**Version:** [Version Number]
**Date:** [Date]
**Prepared By:** [Name]

**1. Scope**
**In Scope:**
- [Feature/Module 1]
- [Feature/Module 2]
- [Feature/Module 3]

**Out of Scope:**
- [What won't be tested]

**2. Test Objectives**
- Verify functional requirements
- Validate user workflows
- Ensure cross-browser compatibility
- Performance benchmarking
- Security testing

**3. Test Strategy**
**Types of Testing:**
- [ ] Unit Testing
- [ ] Integration Testing
- [ ] System Testing
- [ ] Regression Testing
- [ ] Performance Testing
- [ ] Security Testing
- [ ] Usability Testing

**4. Test Environment**
- Browsers: [Chrome, Firefox, Safari, Edge]
- Devices: [Desktop, Mobile, Tablet]
- Operating Systems: [Windows, macOS, iOS, Android]
- Test Data: [Source and setup instructions]

**5. Entry Criteria**
- [ ] Requirements documented
- [ ] Test environment setup
- [ ] Test data prepared
- [ ] Build deployed

**6. Exit Criteria**
- [ ] All test cases executed
- [ ] 95%+ pass rate
- [ ] No critical/high bugs open
- [ ] Test summary report completed

**7. Risks & Mitigation**
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | [High/Med/Low] | [Strategy] |

**8. Deliverables**
- Test cases
- Test execution reports
- Bug reports
- Test summary report

**9. Schedule**
| Activity | Start Date | End Date | Owner |
|----------|------------|----------|-------|
| Test Design | [Date] | [Date] | [Name] |
| Test Execution | [Date] | [Date] | [Name] |`
  },
  {
    id: 'regression-checklist',
    title: 'Regression Testing Checklist',
    category: 'Checklist',
    icon: <ClipboardList className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    template: `## Regression Testing Checklist

**Build Version:** [Version]
**Date:** [Date]
**Tester:** [Name]

**Core Functionality**
- [ ] User login/logout
- [ ] User registration
- [ ] Password reset
- [ ] Profile management
- [ ] Navigation between pages
- [ ] Search functionality
- [ ] Form submissions
- [ ] Data validation

**UI/UX**
- [ ] Layout rendering correctly
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Images loading properly
- [ ] Icons and buttons visible
- [ ] No console errors
- [ ] Proper error messages displayed

**Integration Points**
- [ ] API endpoints working
- [ ] Third-party integrations
- [ ] Payment processing
- [ ] Email notifications
- [ ] File uploads/downloads
- [ ] Database operations

**Cross-Browser Testing**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Security**
- [ ] Authentication working
- [ ] Authorization checks
- [ ] Session management
- [ ] HTTPS enabled
- [ ] No sensitive data in URLs

**Performance**
- [ ] Page load times acceptable
- [ ] No memory leaks
- [ ] API response times normal
- [ ] Database queries optimized

**Critical User Journeys**
1. [ ] [Journey 1 - e.g., Complete purchase]
2. [ ] [Journey 2 - e.g., Create account and login]
3. [ ] [Journey 3 - e.g., Submit form]

**Notes:**
[Any issues or observations]

**Result:** 
- [ ] Pass - Ready for deployment
- [ ] Fail - Issues need resolution`
  },
  {
    id: 'test-summary',
    title: 'Test Summary Report',
    category: 'Reporting',
    icon: <FileText className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    template: `## Test Summary Report

**Project:** [Project Name]
**Release:** [Version]
**Test Period:** [Start Date] - [End Date]
**Prepared By:** [Name]
**Date:** [Date]

**Executive Summary**
[Brief overview of testing activities and results]

**Test Scope**
- Features tested: [List]
- Test types executed: [Unit, Integration, E2E, etc.]
- Environments: [Dev, Staging, Production]

**Test Metrics**

**Test Execution:**
- Total Test Cases: [Number]
- Executed: [Number]
- Passed: [Number] ([Percentage]%)
- Failed: [Number] ([Percentage]%)
- Blocked: [Number]
- Not Executed: [Number]

**Defect Summary:**
- Total Bugs Found: [Number]
- Critical: [Number]
- High: [Number]
- Medium: [Number]
- Low: [Number]

**Bug Status:**
- Open: [Number]
- In Progress: [Number]
- Fixed: [Number]
- Closed: [Number]
- Won't Fix: [Number]

**Test Coverage**
- Requirements Coverage: [Percentage]%
- Code Coverage: [Percentage]%
- Automation Coverage: [Percentage]%

**Key Achievements**
- [Achievement 1]
- [Achievement 2]
- [Achievement 3]

**Issues & Risks**
- [Issue/Risk 1]
- [Issue/Risk 2]

**Recommendations**
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

**Conclusion**
[Overall assessment and go/no-go recommendation]

**Sign-Off**
- QA Lead: _____________ Date: _______
- Project Manager: _____________ Date: _______`
  }
];

export function Templates({ searchQuery }: TemplatesProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const filteredTemplates = templates.filter(template =>
    searchQuery === '' ||
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-slate-900">Templates</h2>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Submit Template
          </button>
        </div>
        <p className="text-slate-600">Professional templates for bug reports, triage, test plans, and more</p>
      </div>

      {showSubmitForm && (
        <SubmitTemplate 
          onClose={() => setShowSubmitForm(false)}
          onSuccess={() => {
            setShowSubmitForm(false);
          }}
        />
      )}

      <p className="text-slate-600 mb-6">
        {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${template.color}`}>
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="text-slate-900">{template.title}</h3>
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs mt-1">
                      {template.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(template.template, template.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  {copiedId === template.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
                  {template.template}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No templates found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}