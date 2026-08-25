/**
 * Challenge 3.6 — State Machine: Document Approval Flow
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 3, Challenge 3.6)
 *
 * TODO:
 * - states: `draft`, `under_review`, `approved`, `rejected`, `published`
 * - events: `submit`, `approve`, `reject`, `revise`, `publish`
 * - transition table:
 *   - `draft` --submit--> `under_review`
 *   - `under_review` --approve--> `approved`
 *   - `under_review` --reject--> `rejected`
 *   - `rejected` --revise--> `draft`
 *   - `approved` --publish--> `published`
 * - `DocumentWorkflow` class implementing it
 * - checks confirming: a draft can be submitted; a rejected document can be
 *   revised back to draft; calling `publish()` from `draft` throws an
 *   illegal-transition error
 *
 * Focus: boolean flags (`isApproved`, `isRejected`) would allow impossible
 * combinations; the state machine doesn't.
 */
import assert from 'node:assert';

type DocumentState =
  | 'draft'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'published';

type DocumentEvent = 'submit' | 'approve' | 'reject' | 'revise' | 'publish';

const transitions: Record<
  DocumentState,
  Partial<Record<DocumentEvent, DocumentState>>
> = {
  draft: { submit: 'under_review' },
  under_review: { approve: 'approved', reject: 'rejected' },
  approved: { publish: 'published' },
  rejected: { revise: 'draft' },
  published: {},
};

class DocumentWorkflow {
  private state: DocumentState = 'draft';

  getState(): DocumentState {
    return this.state;
  }

  transition(event: DocumentEvent): void {
    const next = transitions[this.state][event];
    if (!next) {
      throw new Error(`Illegal transition: ${event} from ${this.state}`);
    }
    this.state = next;
  }

  submit(): void {
    this.transition('submit');
  }

  approve(): void {
    this.transition('approve');
  }

  reject(): void {
    this.transition('reject');
  }

  revise(): void {
    this.transition('revise');
  }

  publish(): void {
    this.transition('publish');
  }
}

// ---- Checks -----------------------------------------------------------------

function main(): void {
  // A draft can be submitted.
  const doc1 = new DocumentWorkflow();
  assert.strictEqual(doc1.getState(), 'draft');
  doc1.submit();
  assert.strictEqual(doc1.getState(), 'under_review');
  console.log('Test passed: draft -> submit -> under_review');

  // A rejected document can be revised back to draft.
  const doc2 = new DocumentWorkflow();
  doc2.submit();
  doc2.reject();
  assert.strictEqual(doc2.getState(), 'rejected');
  doc2.revise();
  assert.strictEqual(doc2.getState(), 'draft');
  console.log('Test passed: rejected -> revise -> draft');

  // Calling publish() from draft throws an illegal-transition error.
  const doc3 = new DocumentWorkflow();
  assert.throws(
    () => doc3.publish(),
    /Illegal transition: publish from draft/,
  );
  console.log(
    'Test passed: publish() from draft throws an illegal-transition error',
  );

  // Bonus: the full happy path really does reach published.
  const doc4 = new DocumentWorkflow();
  doc4.submit();
  doc4.approve();
  doc4.publish();
  assert.strictEqual(doc4.getState(), 'published');
  console.log('Test passed: submit -> approve -> publish reaches published');

  console.log(
    '🎉 The workflow only allows valid transitions — no boolean flags needed',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
