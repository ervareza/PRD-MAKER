/* eslint-disable @typescript-eslint/no-explicit-any */
export function generateMarkdownAndDownload(title: string, versionNumber: number, c: any) {
  if (!c) return

  let md = `# ${title} — v${versionNumber}\n\n`
  md += `## Executive Summary\n\n${c.executiveSummary || ''}\n\n`

  if (c.problemStatement) {
    md += `## Problem Statement\n\n${c.problemStatement.description || ''}\n\n`
    if (c.problemStatement.painPoints?.length) {
      md += `### Pain Points\n\n${c.problemStatement.painPoints.map((p: string) => `- ${p}`).join('\n')}\n\n`
    }
    if (c.problemStatement.currentAlternatives) md += `### Current Alternatives\n\n${c.problemStatement.currentAlternatives}\n\n`
    if (c.problemStatement.marketGap) md += `### Market Gap\n\n${c.problemStatement.marketGap}\n\n`
  }

  if (c.goals) {
    md += `## Goals\n\n`
    if (c.goals.businessGoals?.length) md += `### Business Goals\n\n${c.goals.businessGoals.map((g: string) => `- ${g}`).join('\n')}\n\n`
    if (c.goals.userGoals?.length) md += `### User Goals\n\n${c.goals.userGoals.map((g: string) => `- ${g}`).join('\n')}\n\n`
    if (c.goals.nonGoals?.length) md += `### Non-Goals\n\n${c.goals.nonGoals.map((g: string) => `- ${g}`).join('\n')}\n\n`
  }

  if (c.targetAudience) {
    md += `## Target Audience\n\n`
    if (c.targetAudience.primaryAudience) md += `**Primary:** ${c.targetAudience.primaryAudience}\n\n`
    if (c.targetAudience.secondaryAudience) md += `**Secondary:** ${c.targetAudience.secondaryAudience}\n\n`
    if (c.targetAudience.marketSize) md += `**Market Size:** ${c.targetAudience.marketSize}\n\n`
  }

  if (c.userPersonas?.length) {
    md += `## User Personas\n\n`
    c.userPersonas.forEach((p: any) => {
      md += `### ${p.name}${p.role ? ` — ${p.role}` : ''}\n\n${p.description}\n\n`
      if (p.goals?.length) md += `**Goals:** ${p.goals.join(', ')}\n\n`
      if (p.frustrations?.length) md += `**Frustrations:** ${p.frustrations.join(', ')}\n\n`
      if (p.quote) md += `> "${p.quote}"\n\n`
    })
  }

  if (c.userStories?.length) {
    md += `## User Stories\n\n`
    c.userStories.forEach((s: any) => {
      md += `- **[${s.priority}]** ${s.story}\n`
      s.acceptanceCriteria?.forEach((ac: string) => { md += `  - AC: ${ac}\n` })
    })
    md += '\n'
  }

  if (c.coreFeatures?.length) {
    md += `## Core Features\n\n`
    c.coreFeatures.forEach((f: any) => {
      md += `### ${f.feature} [${f.priority}]\n\n${f.description}\n\n`
      if (f.userBenefit) md += `**User Benefit:** ${f.userBenefit}\n\n`
      if (f.acceptanceCriteria?.length) {
        md += `**Acceptance Criteria:**\n${f.acceptanceCriteria.map((ac: string) => `- ${ac}`).join('\n')}\n\n`
      }
      if (f.complexity) md += `**Complexity:** ${f.complexity}`
      if (f.estimatedEffort) md += ` | **Effort:** ${f.estimatedEffort}`
      md += '\n\n'
    })
  }

  if (c.userFlows?.length) {
    md += `## User Flows\n\n`
    c.userFlows.forEach((flow: any) => {
      md += `### ${flow.name}\n\n`
      flow.steps.forEach((step: string, i: number) => { md += `${i + 1}. ${step}\n` })
      if (flow.happyPath) md += `\n**Happy Path:** ${flow.happyPath}\n`
      if (flow.edgeCases?.length) md += `\n**Edge Cases:** ${flow.edgeCases.join('; ')}\n`
      md += '\n'
    })
  }

  // ── Mermaid Diagrams ──
  if (c.architectureDiagram) {
    md += `## System Architecture\n\n\`\`\`mermaid\n${c.architectureDiagram}\n\`\`\`\n\n`
  }

  if (c.userJourneyDiagram) {
    md += `## User Journey\n\n\`\`\`mermaid\n${c.userJourneyDiagram}\n\`\`\`\n\n`
  }

  if (c.nonFunctionalRequirements) {
    md += `## Non-Functional Requirements\n\n`
    const nfr = c.nonFunctionalRequirements
    if (Array.isArray(nfr)) {
      nfr.forEach((r: string) => { md += `- ${r}\n` })
    } else {
      Object.entries(nfr).forEach(([cat, items]) => {
        md += `### ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n\n`
        if (Array.isArray(items)) (items as string[]).forEach((item: string) => { md += `- ${item}\n` })
        md += '\n'
      })
    }
  }

  if (c.techStackRecommendation) {
    md += `## Tech Stack\n\n`
    const ts = c.techStackRecommendation
    const layers = ['frontend', 'backend', 'database', 'infrastructure'] as const
    layers.forEach(layer => {
      const entry = ts[layer]
      if (entry) {
        const tech = typeof entry === 'string' ? entry : entry.technology
        const reason = typeof entry === 'object' ? entry.reasoning : undefined
        md += `**${layer.charAt(0).toUpperCase() + layer.slice(1)}:** ${tech}${reason ? ` — ${reason}` : ''}\n\n`
      }
    })
    if (ts.architecturePattern) md += `**Architecture:** ${ts.architecturePattern}\n\n`
    if (ts.thirdPartyServices?.length) {
      md += `### Third-Party Services\n\n`
      ts.thirdPartyServices.forEach((s: { service: string; purpose: string }) => {
        md += `- **${s.service}:** ${s.purpose}\n`
      })
      md += '\n'
    }
  }

  // ── Data Model (new + legacy) ──
  if (c.dataModel) {
    md += `## Data Model\n\n`
    if (!Array.isArray(c.dataModel)) {
      // New format with ERD + tables
      if (c.dataModel.erdDiagram) {
        md += `### Entity Relationship Diagram\n\n\`\`\`mermaid\n${c.dataModel.erdDiagram}\n\`\`\`\n\n`
      }
      if (c.dataModel.tables?.length) {
        c.dataModel.tables.forEach((t: any) => {
          md += `### ${t.tableName}\n\n`
          if (t.description) md += `${t.description}\n\n`
          md += `| Key | Column | Type | Constraints |\n|---|---|---|---|\n`
          t.columns.forEach((col: any) => {
            const isPK = col.constraints?.toUpperCase().includes('PRIMARY KEY')
            const isFK = col.constraints?.toUpperCase().includes('REFERENCES') || col.name.endsWith('_id')
            const keyIcon = isPK ? '🔑' : (isFK ? '🔗' : '')
            md += `| ${keyIcon} | ${col.name} | \`${col.type}\` | ${col.constraints || '—'} |\n`
          })
          md += '\n'
          if (t.indexes?.length) {
            md += `**Indexes:** ${t.indexes.join(', ')}\n\n`
          }
          if (t.relationships?.length) {
            md += `**Relationships:** ${t.relationships.join(' · ')}\n\n`
          }
        })
      }
    } else {
      // Legacy format
      c.dataModel.forEach((e: any) => {
        md += `### ${e.entity}\n\n`
        md += `| Field |\n|---|\n`
        e.fields.forEach((f: string) => { md += `| ${f} |\n` })
        if (e.relationships?.length) md += `\n**Relationships:** ${e.relationships.join(', ')}\n`
        md += '\n'
      })
    }
  }

  // ── API Endpoints ──
  if (c.apiEndpoints?.length) {
    md += `## API Design\n\n`
    md += `| Method | Endpoint | Description | Auth |\n|---|---|---|---|\n`
    c.apiEndpoints.forEach((ep: any) => {
      md += `| \`${ep.method.toUpperCase()}\` | \`${ep.path}\` | ${ep.description || '—'} | ${ep.authentication || '—'} |\n`
    })
    md += '\n'
    // Detailed endpoint specs
    c.apiEndpoints.forEach((ep: any) => {
      md += `### \`${ep.method.toUpperCase()}\` ${ep.path}\n\n`
      if (ep.description) md += `${ep.description}\n\n`
      if (ep.requestParams?.length) {
        md += `**Request Params:**\n${ep.requestParams.map((p: string) => `- ${p}`).join('\n')}\n\n`
      }
      if (ep.requestBody?.length) {
        md += `**Request Body:**\n${ep.requestBody.map((b: string) => `- ${b}`).join('\n')}\n\n`
      }
      if (ep.responseBody) md += `**Response:** \`${ep.responseBody}\`\n\n`
      if (ep.responseCodes?.length) md += `**Status Codes:** ${ep.responseCodes.join(', ')}\n\n`
    })
  }

  if (c.milestones?.length) {
    md += `## Milestones\n\n`
    c.milestones.forEach((m: any) => {
      md += `### ${m.phase}${m.duration ? ` (${m.duration})` : ''}\n\n`
      if (m.deliverables?.length) {
        md += `**Deliverables:**\n${m.deliverables.map((d: string) => `- ${d}`).join('\n')}\n\n`
      }
      if (m.successMetrics?.length) {
        md += `**Success Metrics:** ${m.successMetrics.join(', ')}\n\n`
      }
    })
  }

  if (c.successMetrics) {
    md += `## Success Metrics\n\n`
    if (c.successMetrics.northStarMetric) md += `**North Star:** ${c.successMetrics.northStarMetric}\n\n`
    const printKpis = (label: string, kpis?: Array<{ metric: string; target: string; measurement?: string }>) => {
      if (!kpis?.length) return
      md += `### ${label}\n\n| Metric | Target | Measurement |\n|---|---|---|\n`
      kpis.forEach(k => { md += `| ${k.metric} | ${k.target} | ${k.measurement || '-'} |\n` })
      md += '\n'
    }
    printKpis('Primary KPIs', c.successMetrics.primaryKPIs)
    printKpis('Secondary KPIs', c.successMetrics.secondaryKPIs)
  }

  if (c.risksAndMitigations?.length) {
    md += `## Risks & Mitigations\n\n| Risk | Impact | Likelihood | Mitigation |\n|---|---|---|---|\n`
    c.risksAndMitigations.forEach((r: any) => {
      md += `| ${r.risk} | ${r.impact || '-'} | ${r.likelihood || '-'} | ${r.mitigation || '-'} |\n`
    })
    md += '\n'
  }

  if (c.openQuestions?.length) {
    md += `## Open Questions\n\n${c.openQuestions.map((q: string) => `- ${q}`).join('\n')}\n`
  }

  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/\s+/g, '_')}_v${versionNumber}.md`
  a.click()
  URL.revokeObjectURL(url)
}
