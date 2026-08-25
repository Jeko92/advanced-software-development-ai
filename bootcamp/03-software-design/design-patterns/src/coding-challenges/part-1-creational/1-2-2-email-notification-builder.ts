/**
 * Challenge 1.2.2 — Email Notification Builder
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 1, Challenge 1.2.2)
 *
 * TODO:
 * - `EmailBuilder` with setters for `to`, `cc` (array, additive), `bcc`
 *   (array, additive), `subject`, `body`, `attachment` (array, additive),
 *   `priority` — each returns `this`
 * - `build()` throws unless `to` and `subject` are both set
 * - returns a read-only `Email` object (no setters)
 *
 * Focus: builders shine when construction has many optional parts and
 * cross-field validation.
 */

interface Email {
  to: string;
  cc: readonly string[];
  bcc: readonly string[];
  subject: string;
  body?: string;
  attachment: readonly string[];
  priority?: number;
}

class EmailBuilder {
  private emailParts = {
    cc: [] as string[],
    bcc: [] as string[],
    attachment: [] as string[],
    to: undefined as string | undefined,
    subject: undefined as string | undefined,
    body: undefined as string | undefined,
    priority: undefined as number | undefined,
  };

  to(to: string): this {
    this.emailParts.to = to;
    return this;
  }

  cc(email: string): this {
    this.emailParts.cc.push(email);
    return this;
  }

  bcc(email: string): this {
    this.emailParts.bcc.push(email);
    return this;
  }

  subject(subject: string): this {
    this.emailParts.subject = subject;
    return this;
  }

  body(body: string): this {
    this.emailParts.body = body;
    return this;
  }

  attachment(attachment: string): this {
    this.emailParts.attachment.push(attachment);
    return this;
  }

  priority(priority: number): this {
    this.emailParts.priority = priority;
    return this;
  }

  build(): Email {
    const { to, subject, body, priority } = this.emailParts;

    if (to === undefined) {
      throw new Error('Email recipient (to) is required.');
    }

    if (subject === undefined) {
      throw new Error('Email subject is required.');
    }

    const email: Email = {
      to,
      cc: [...this.emailParts.cc],
      bcc: [...this.emailParts.bcc],
      subject,
      attachment: [...this.emailParts.attachment],
    };

    if (body !== undefined) {
      email.body = body;
    }

    if (priority !== undefined) {
      email.priority = priority;
    }

    return email;
  }
}

const email = new EmailBuilder()
  .to('max@mail.com')
  .cc('alice@mail.com')
  .cc('bob@mail.com')
  .bcc('admin@mail.com')
  .subject('Invoice')
  .body('Please find the invoice attached.')
  .attachment('invoice.pdf')
  .attachment('terms.pdf')
  .priority(2)
  .build();

console.log(email);
