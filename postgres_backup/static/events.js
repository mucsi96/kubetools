export class AppEvent extends Event {
  constructor(name) {
    super(name, { bubbles: true, composed: true });
  }
}

export class AppErrorEvent extends AppEvent {
  constructor(error) {
    super("app-error");
    this.details = error;
    console.error(error);
  }
}

export class BackupCreatedEvent extends AppEvent {
  constructor() {
    super("backup-created");
  }
}
