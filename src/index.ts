(() => {
  enum ViewMode {
    TODO = "TODO",
    REMINDER = "REMINDER",
  }

  enum NotificationPlataform {
    SMS = "SMS",
    EMAIL = "EMAIL",
    PUSH_NOTIFICATION = "PUSH_NOTIFICATION",
  }

  const RID = (): string => {
    const id = (Math.random() * (1 + 100)).toString();
    return id;
  };

  interface Task {
    id: string;
    dateCreated: Date;
    dateUpdated: Date;
    description: string;
    render(): string;
  }

  const DateUtils = {
    formatDate(date: Date): string {
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    },
    today(): Date {
      const today = new Date();
      return today;
    },
    tomorrow(): Date {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    },
  };

  class Reminder implements Task {
    id: string = RID();
    dateCreated: Date = DateUtils.today();
    dateUpdated: Date = DateUtils.today();
    description: string = "";
    scheduleDate: Date = DateUtils.tomorrow();
    notification: Array<NotificationPlataform> = [NotificationPlataform.EMAIL];
    constructor(
      description: string,
      scheduleDate: Date,
      notification: Array<NotificationPlataform>
    ) {
      this.description = description;
      this.scheduleDate = scheduleDate;
      this.notification = notification;
    }
    render(): string {
      return `--->REMINDER<----\n
        DESCRIPTION: ${this.description}\n
        DATE: ${DateUtils.formatDate(this.scheduleDate)}\n
        PLATAFORM: ${this.notification.join(",")}
      `;
    }
  }

  class Todo implements Task {
    id: string = RID();
    dateCreated: Date = DateUtils.today();
    dateUpdated: Date = DateUtils.today();
    description: string = "";
    done: boolean = false;
    render(): string {
      return `-->TODO<--\n
      DESCRIPTION: ${this.description} \n
      DONE: ${this.done}`;
    }

    constructor(description: string) {
      this.description = description;
    }
  }

  const taskView = {
    getTodo(form: HTMLFormElement): Todo {
      const todoDescription = form.todoDescription.value;
      form.reset();
      return new Todo(todoDescription);
    },
    getReminder(form: HTMLFormElement): Reminder {
      const reminderNotification = [
        form.notification.value as NotificationPlataform,
      ];
      const reminderDate = new Date(form.scheduleDate.value);
      const reminderDescription = form.reminderDescription.value;
      form.reset();
      return new Reminder(
        reminderDescription,
        reminderDate,
        reminderNotification
      );
    },
    render(tasks: Array<Task>, mode: ViewMode) {
      const tasksList = document.getElementById("taskList");

      while (tasksList?.firstChild) {
        tasksList.removeChild(tasksList.firstChild);
      }

      tasks.forEach((task) => {
        const li = document.createElement("li");
        const textNode = document.createTextNode(task.render());
        li.appendChild(textNode);
        tasksList?.appendChild(li);
        console.log(JSON.stringify(task));
      });

      const todoSet = document.getElementById("todoSet");
      const reminderSet = document.getElementById("reminderSet");

      if (mode === ViewMode.TODO) {
        todoSet?.setAttribute("style", "display: block");
        todoSet?.removeAttribute("disabled");
        reminderSet?.setAttribute("style", "display: none");
        reminderSet?.setAttribute("disabled", "true");
      } else {
        reminderSet?.setAttribute("style", "display: block");
        reminderSet?.removeAttribute("disabled");
        todoSet?.setAttribute("style", "display: none");
        todoSet?.setAttribute("disabled", "true");
      }
    },
  };

  const TaskController = (view: typeof taskView) => {
    const tasks: Array<Task> = [];
    let mode: ViewMode = ViewMode.TODO;

    const handleEvent = (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      switch (mode as ViewMode) {
        case ViewMode.TODO:
          tasks.push(view.getTodo(form));
          break;
        case ViewMode.REMINDER:
          tasks.push(view.getReminder(form));
          break;
      }
      view.render(tasks, mode);
    };

    const handleToggleMode = () => {
      switch (mode as ViewMode) {
        case ViewMode.TODO:
          mode = ViewMode.REMINDER;
          break;
        case ViewMode.REMINDER:
          mode = ViewMode.TODO;
          break;
      }
      view.render(tasks, mode);
    };

    document
      .getElementById("toggleMode")
      ?.addEventListener("click", handleToggleMode);
    document
      .getElementById("taskForm")
      ?.addEventListener("submit", handleEvent);
  };

  TaskController(taskView);
})();
