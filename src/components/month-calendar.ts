import { LitElement, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DateTime, Info } from "luxon";

/**
 * Month-Calendar custom Lit web component. More about Lit: https://lit.dev/docs/
 * It display a month table accoring to the given parameters: year, month, locale, year-is-first.
 * 'Year' is a number, like 2024.
 * The 'month' is also a number between 1 and 12.
 * The 'locale' and the DateTime is based on the Luxon library, more info: https://moment.github.io/luxon/api-docs/index.html#luxon
 * The 'year-is-first' / 'yearIsFirst' parameter is drive if the format of the month calendar header is year-month vs month-year (2024 July vs July 2024).
 * If you don't give yearIsFirst parameter then the default value will be used, which is false.
 * The 'weekdays' controls the week names length. The available values: 'narrow', 'short', 'long'. The default value is 'short'. For more info: https://moment.github.io/luxon/api-docs/index.html#infoweekdays
 * 
 * @author gl0b3 (aka Károly Kótay-Szabó)
 */
@customElement("month-calendar")
export class MonthCalendar extends LitElement {
  @property({ type: Number, attribute: 'month', reflect: true }) month: number;
  @property({ type: Number, attribute: 'year', reflect: true }) year: number;
  @property({ type: String, attribute: 'locale', reflect: true}) locale: string = "en"; 
  @property({ type: Boolean, attribute: 'year-is-first', reflect: true }) yearIsFirst: boolean = false;
  @property({ type: Boolean, attribute: 'show-other-month-days', reflect: true}) showOtherMonthDays: boolean = false;
  @property({ type: String , attribute: 'weekday-type', reflect: true}) weekdayType: 'narrow'|'short'|'long' = 'short';

  /**
   * This runs first when we create the object.
   */
  constructor() {
    super();
    let nRoot = this.attachShadow({ mode: "open" });
    nRoot.innerHTML = MonthCalendar.getStyles();
  }

  /**
   * Renders the template of the custom Lit component
   * @returns {TemplateResult} the template we want to display int he browser
   */
  render(): TemplateResult {
    const monthDays: DateTime[] = this.getMonthDays();
    const now = DateTime.now();

    return html`
      <div class="month-calendar" month-id="${this.year}-${this.month < 10 ? '0' + this.month : this.month}" part="month-calendar">
        <table cellspacing="0" cellpadding="0">
          <colgroup>
            <col />
          </colgroup>
          <tbody id="month-tbody">
            <tr class="header">
              <td colspan="7">
                <table class="header" cellspacing="0" cellpadding="0" style="width: 100%">
                  <tbody>
                    <tr>
                      <td align="center" style="vertical-align: top;">
                        <div id="year-month" class="year-month-header">
                          <span id=${this.year} class="year" style="float: ${this.yearIsFirst ? 'left' : 'right'}">${this.year}</span>
                          <span id=${this.month} class="month" style="float: ${this.yearIsFirst ? 'right' : 'left'}">${this.createMonthValue()}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr class="weekdays">
              ${Info.weekdays(this.weekdayType, { locale: this.locale }).map(
                (day, index) =>
                  html`
                    <td align="center" class="${index > 0 && (index % 5 === 0 || index % 6 === 0) ? 'weekend' : 'weekday'}">
                      ${day}
                    </td>
                  `
              )}
            </tr>
            ${Array.from({length: this.getWeeksInMonth()}, (_, weekIndex) => html`
              <tr class="week">
                ${Array.from({length: 7}, (__, dayIndex) => html`
                  ${this.createDayTD(monthDays[weekIndex * 7 + dayIndex], dayIndex, now)}
                `)}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  private createDayTD(monthDay: DateTime, dayIndex: number, now: DateTime) {
    // If only the current month days are interesting and the date is in other month then we generate empty table cell
    if (!this.showOtherMonthDays && monthDay.month !== this.month) {
      return html`<td class="${this.getDayStyleClass(now, monthDay, dayIndex)}"></td>`;
    }
    // Else, we have to generate whole weeks, no matter if they starts or ends in other month
    return html`
      <td cell-id="${this.createDayId(monthDay)}"
        cell-type="${(dayIndex === 5 || dayIndex === 6) ? 'weekend' : 'weekday'}"
        class="${this.getDayStyleClass(now, monthDay, dayIndex)}">
        ${monthDay.day.toString()}
      </td>
    `;
  }

  /**
   * Returns the table cell style class of the day based on the two dates received in the parameter and the day index.
   * @returns the calculated style class
   */
  private getDayStyleClass(now: DateTime, inspectedDate: DateTime, dayIndex: number): string {
    let style: string = (now.year === this.year && now.month === this.month && now.day === inspectedDate.day) ? 'today': 'day';
    style = style.concat(inspectedDate.month === this.month ? ' currentmonth': ' othermonth');
    style = style.concat((dayIndex === 5 || dayIndex === 6) ? ' weekend' : '');
    return style;
  }

  /**
   * Returns all days of the month, including the first and last full week of the month.
   * @returns {DateTime[]} with days of the month
   */
  private getMonthDays(): DateTime[] {
    const firstDayOfMonthFirstWeek: DateTime = this.getFirstDayOfMonthFirstWeek();

    let dayIndex = 0;
    let monthDays: DateTime[] = [];
    for (let week = 0; week < this.getWeeksInMonth(); week++) {
      for (let day = 0; day < 7; day++) {
        monthDays.push(firstDayOfMonthFirstWeek.plus({ days: dayIndex++ }));
      }
    }

    return monthDays;
  }

  /**
   * Returns the number of the weeks in the actual month. If the month is the first or the last of the year, it is taken into account.
   * @returns {number} the number of the weeks in the month
   */
  private getWeeksInMonth(): number {
    const firstDayDateTime: DateTime = DateTime.fromObject({
      year: this.year,
      month: this.month,
      day: 1,
    }, {
      locale: this.locale
    });

    const lastDayDateTime: DateTime = DateTime.fromObject({
      year: this.year,
      month: this.month,
      day: firstDayDateTime.daysInMonth,
    }, {
      locale: this.locale
    });

    const firstWeekNumber = firstDayDateTime.weekNumber;

    const lastWeekNumber = lastDayDateTime.weekNumber;

    const weeksInMonth =
      firstWeekNumber > lastWeekNumber
        ? (firstDayDateTime.month == 12 ? firstDayDateTime.weeksInWeekYear - firstWeekNumber + lastWeekNumber + 1 : lastWeekNumber + 1)
        : lastWeekNumber - firstWeekNumber + 1;

    return weeksInMonth;
  }

  /**
   * Gives the first day of the first week of the year. Ie: in 2023, the first day of the first week is 26th of december.
   * @returns {DateTime} first day of the first week date
   */
  private getFirstDayOfMonthFirstWeek(): DateTime {
    const firstDayDateTime = DateTime.fromObject({
      year: this.year,
      month: this.month,
      day: 1,
    }, {
      locale: this.locale
    });
    const weekday: number = firstDayDateTime.weekday;
    const firstDayOfMonthFirstWeek = firstDayDateTime.minus({
      days: weekday - 1,
    });
    return firstDayOfMonthFirstWeek;
  }

  /**
   * Gives the short literal version of the month according to the actual locale. Ie: for month: 5 with 'en' locale it's May, with 'hu' local is Május.
   * @returns {string} the short literale of the month
   */
  private createMonthValue(): string {
    const monthLong: string = DateTime.fromObject({
      year: this.year,
      month: this.month,
    },
    {
      locale: this.locale
    }).monthLong.toLocaleString();

    if (monthLong && monthLong.length > 0) {
      return monthLong[0].toUpperCase() + monthLong.slice(1);
    }
    return '';
  }

  /**
   * Create ID for the day cell. It serves to find the day esier later.
   * @param monthDay the date that we want to generate the ID for
   * @returns {string} the generated ID
   */
  private createDayId(monthDay: DateTime): string {
    return this.year + '-' + (monthDay.month < 10 ? '0':'') + monthDay.month + '-' + (monthDay.day < 10 ? '0':'') + monthDay.day;
  }

  /**
   * Remove style class from a day cells by the given cellType.
   * @param cellType the day cell type: 'weekday' or 'weekend'
   * @param className the class to be removed, ie: 'weekend'
   */
  public removeClassFromCellByType(cellType: string, className: string) {
    const markToRemoveWeekendClassTDs = this.shadowRoot?.querySelectorAll('[part="month-calendar"]')[0]
      .querySelectorAll('td[cell-type="' + cellType + '"]');
    markToRemoveWeekendClassTDs?.forEach(weekend => {
      weekend.classList.remove(className);
    });
  }

  /**
   * Add style class to the day cells by the given dates.
   * @param dates the dates that determine which cells have to be modified
   * @param className the style class which have to be add to the cell
   */
  public addClassToCellByDates(dates: Date[], className: string) {
    if (dates != null && dates.length > 0) {
      dates.forEach(date => {
        if (date != null) {
          // Gets the 'yyyy-MM-dd' ISO date
          const dateStr = date.toString().split('T')[0];
          const dateTDs = this.shadowRoot?.querySelectorAll('[part="month-calendar"]')[0].querySelectorAll('td[cell-id="'+ dateStr + '"]');
          dateTDs?.forEach(dateTD => {
            dateTD.classList.add(className);
          });
        }
      });
    }
  }

  // ShadowDOM root
  get root() {
    return this.shadowRoot;
  }
  
  /**
   * If one of the observed attributes changes, this function is calledthen this function will be called.
   * @param name - name of the attribute
   * @param oldval - the old value
   * @param newval - the new value
   */
  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    // this.requestUpdate();
  }

  /**
   * Returns the shadow root or null
   * @returns {ShadowRoot | null}
   */
  createRenderRoot() {
    return this.shadowRoot!;
  }

  /**
   * Shadow style for this component. 
   * @returns styles
   */
  static getStyles() {
    return `<style>
      :host [part="month-calendar"] table {
        cursor: default;
        border-color: transparent;
        border: 1px solid var(--month-primary-color, #006E51);
        border-radius: var(--month-table-border-radius, 8px 8px 8px 8px);
        font-size: var(--month-font-size, 12px);
        font-family: var(--month-font-family, Arial);
      }

      :host [part="month-calendar"] table:not(.header):hover {
        scale: var(--month-table-hover-scale, 1.05);
        transition: var(--month-table-hover-transition, .1s ease-in-out);
        box-shadow: var(--month-table-hover-box-shadow, 3px 3px 5px 0 var(--month-box-shadow-color, #98A3AE));
      }

      :host [part="month-calendar"] table tr:last-child {
        border-radius: var(--month-table-last-row-bottom-radius, 0 0 8px 8px);
      }

      :host [part="month-calendar"] table tr:last-child td:first-child {
        border-radius: var(--month-last-row-border-bottom-left-radius, 0 0 0 6px);
      }

      :host [part="month-calendar"] table tr:last-child td:last-child {
        border-radius: var(--month-last-row-border-bottom-right-radius, 0 0 6px 0);
      }  

      :host [part="month-calendar"] table tr.weekdays td.weekend {
        background-color: var(--month-weekdays-weekend-background-color, #FFA500);
      }
  
      :host [part="month-calendar"] table tr.weekdays td,
      :host [part="month-calendar"] table tr.week td.day,
      :host [part="month-calendar"] table tr.week td.today {
        color: var(--month-day-color, #000000);
        width: var(--month-day-cell-width, 1.8em);
        line-height: var(--month-day-cell-height, 24px);
        text-align: center;
        font-weight: var(--month-day-font-weight, normal);
        user-select: var(--month-day-user-select, none);
      }

      :host [part="month-calendar"] table tr.weekdays td {
        background-color: var(--month-weekdays-background-color, #FFFFFF);
        border-bottom: 1px solid var(--month-primary-color, #006E51);
      }
      
      :host [part="month-calendar"] table tr.week td.day {
        background-color: var(--month-day-background-color, #FFFFFF);
      }

      :host [part="month-calendar"] table tr.week td.today {
        background-color: var(--month-today-background-color, #FFFFFF);
        color: var(--month-today-color, #006E51);
        border: 1px solid var(--month-today-color, #006E51);
        user-select: var(--month-today-user-select, none);
      }
  
      :host [part="month-calendar"] table tr.header td {
        vertical-align: middle;
        padding-top: var(--month-header-padding-top, 1px);
        padding-right: var(--month-header-padding-right, 4px);
        padding-bottom: var(--month-header-padding-bottom, 1px);
        padding-left: var(--month-header-padding-left, 4px);
        border-top-left-radius: var(--month-header-border-top-left-radius, 6px);
        border-top-right-radius: var(--month-header-border-top-right-radius, 6px);
        background-color: var(--month-primary-color, #006E51) !important;
        color: var(--month-header-color, #FFFFFF);
        user-select: var(--month-header-user-select, none);
      }

      :host [part="month-calendar"] table tr.weekdays td.currentmonth:hover, 
      :host [part="month-calendar"] table tr.week td.day.currentmonth:hover {
        color: var(--month-day-hover-color, inherit) !important;
        background-color: var(--month-day-hover-background-color, #D5D5D5) !important;
      }
  
      :host [part="month-calendar"] table tr.week td.day.othermonth {
        color: var(--month-othermonth-day-color, #838383);
        font-weight: normal;
      }
  
      :host [part="month-calendar"] table tr.week td.day.inactive {
        background-color: var(--month-inactive-day-background-color, #FFA500);
      }
      
      :host [part="month-calendar"] table tr.week td[cell-type].day.weekend {
        background-color: var(--month-week-weekend-background-color, #FFA500);
      }
    </style>`
  };
}

/**
 * Declaring the month-calendar tag for global
 */
declare global {
  interface HTMLElementTagNameMap {
    "month-calendar": MonthCalendar;
  }
}
