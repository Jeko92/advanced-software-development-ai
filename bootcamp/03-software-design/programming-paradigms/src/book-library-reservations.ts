export type SampleReservationInput = {
  memberName: string;
  bookTitle: string;
};

type ReservationStatus = 'reserved' | 'returned' | 'cancelled';

export const sampleReservations: SampleReservationInput[] = [
  { memberName: 'Jane Doe', bookTitle: 'Dune' },
  { memberName: 'John Smith', bookTitle: '1984' },
  { memberName: 'Alex Kim', bookTitle: 'The Hobbit' },
];

class BookReservation {
  memberName: string;
  bookTitle: string;
  #reservationStatus: ReservationStatus;

  constructor(name: string, title: string) {
    this.memberName = name;
    this.bookTitle = title;
    this.#reservationStatus = 'reserved';
  }

  async markReturned() {
    if (['returned', 'cancelled'].includes(this.#reservationStatus)) {
      throw new Error(
        'This reservation has already been returned or cancelled.',
      );
    }

    console.log('Returning...');

    await new Promise((resolve) => setTimeout(resolve, 500));

    this.#reservationStatus = 'returned';

    console.log('Returned!');
  }

  async cancel() {
    if (this.#reservationStatus === 'returned') {
      throw new Error('Cannot cancel — the book has already been returned.');
    }

    if (this.#reservationStatus === 'cancelled') {
      throw new Error('Cannot cancel — the reservation is already cancelled.');
    }

    console.log('cancelling...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.#reservationStatus = 'cancelled';
  }

  getStatus(): ReservationStatus {
    console.log(
      `Current reservation from ${this.memberName} for book-${this.bookTitle} has status ${this.#reservationStatus}`,
    );

    return this.#reservationStatus;
  }
}

const processReservations = async () => {
  for (const reservation of sampleReservations) {
    const { memberName, bookTitle } = reservation;
    const newReservation = new BookReservation(memberName, bookTitle);
    newReservation.getStatus();

    try {
      await newReservation.markReturned();
    } catch (err) {
      console.error((err as Error).message);
    }

    newReservation.getStatus();

    console.log(newReservation);
  }
};

processReservations();
