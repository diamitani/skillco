/**
 * Static security screen for third-party skills. Heuristic, not a sandbox:
 * it flags patterns that commonly indicate secrets, destructive commands,
 * remote code execution, data exfiltration, or prompt injection.
 */
export type Severity = "high" | "medium" | "low";
export interface Finding { rule: string; severity: Severity; file: string; line: number; excerpt: string }

const RULES: { id: string; severity: Severity; re: RegExp; scope?: "code" | "all" }[] = [
  // secrets
  { id: "secret-aws-key", severity: "high", re: /AKIA[0-9A-Z]{16}/ },
  { id: "secret-github-token", severity: "high", re: /\b(ghp|gho|ghs|ghu)_[A-Za-z0-9]{30,}\b/ },
  { id: "secret-openai-key", severity: "high", re: /\bsk-(proj-)?[A-Za-z0-9_-]{32,}\b/ },
  { id: "secret-anthropic-key", severity: "high", re: /\bsk-ant-[A-Za-z0-9_-]{30,}\b/ },
  { id: "secret-stripe-live", severity: "high", re: /\b(sk|rk)_live_[0-9a-zA-Z]{20,}\b/ },
  { id: "secret-slack-token", severity: "high", re: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/ },
  { id: "secret-private-key", severity: "high", re: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/ },
  // remote code execution / download-and-run
  { id: "pipe-to-shell", severity: "high", re: /(curl|wget)\s[^\n|]*\|\s*(sudo\s+)?(ba|z)?sh\b/ },
  { id: "eval-remote", severity: "high", re: /eval\s*\(\s*(await\s+)?(fetch|requests\.get|urllib)/ },
  { id: "base64-exec", severity: "high", re: /(base64\s+(-d|--decode)[^\n]*\|\s*(ba)?sh)|(exec\s*\(\s*(base64\.b64decode|atob)\()/ },
  { id: "python-exec-download", severity: "medium", re: /exec\s*\(\s*(requests|urllib)/ },
  // destructive
  { id: "rm-rf-root", severity: "high", re: /rm\s+-rf\s+(--no-preserve-root\s+)?(\/|~|\$HOME)(\s|$)/ },
  { id: "disk-wipe", severity: "high", re: /\b(mkfs\.|dd\s+if=\/dev\/(zero|random)\s+of=\/dev\/)/ },
  { id: "fork-bomb", severity: "high", re: /:\(\)\s*\{\s*:\|:&\s*\};:/ },
  { id: "chmod-777-root", severity: "medium", re: /chmod\s+-R\s+777\s+\// },
  // exfiltration / credential access
  { id: "reads-ssh-keys", severity: "high", re: /~\/\.ssh\/(id_[a-z0-9]+|authorized_keys)|\.aws\/credentials/ },
  { id: "reads-env-and-posts", severity: "medium", re: /(process\.env|os\.environ)[\s\S]{0,200}(fetch|requests\.post|curl)\s*\(/ },
  { id: "webhook-exfil", severity: "medium", re: /(discord(app)?\.com\/api\/webhooks|webhook\.site|requestbin|ngrok\.io|pipedream\.net)/i },
  { id: "crypto-miner", severity: "high", re: /\b(xmrig|stratum\+tcp|coinhive)\b/i },
  // prompt injection inside instructions
  { id: "prompt-injection", severity: "medium", re: /ignore (all |any )?(previous|prior|above) (instructions|rules)|disregard (the )?(system|developer) prompt|do not (tell|inform) the user/i, scope: "all" },
  { id: "hidden-unicode", severity: "medium", re: /[\u200B-\u200F\u202A-\u202E\u2066-\u2069]/, scope: "all" },
  { id: "disable-safety", severity: "low", re: /--dangerously-skip-permissions|--no-verify|bypassPermissions/ },
  { id: "sudo", severity: "low", re: /\bsudo\s+/ },
];

export function scanFile(file: string, content: string): Finding[] {
  const out: Finding[] = [];
  const lines = content.split("\n");
  for (const rule of RULES) {
    for (let i = 0; i < lines.length; i++) {
      if (rule.re.test(lines[i])) {
        out.push({ rule: rule.id, severity: rule.severity, file, line: i + 1, excerpt: lines[i].trim().slice(0, 160) });
        break; // one hit per rule per file is enough
      }
    }
    // multi-line rules
    if (rule.id === "reads-env-and-posts" && !out.some((f) => f.rule === rule.id && f.file === file) && rule.re.test(content)) {
      out.push({ rule: rule.id, severity: rule.severity, file, line: 0, excerpt: "" });
    }
  }
  return out;
}

/** A: clean · B: low-severity only · C: medium · F: any high (excluded from the verified library) */
export function grade(findings: Finding[]): "A" | "B" | "C" | "F" {
  if (findings.some((f) => f.severity === "high")) return "F";
  if (findings.some((f) => f.severity === "medium")) return "C";
  if (findings.length) return "B";
  return "A";
}
