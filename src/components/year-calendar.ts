import { LitElement, html, css, CSSResult, TemplateResult } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import "./month-calendar"
import { MonthCalendar } from "./month-calendar";

/**
 * Year-Calendar custom Lit web component. More about Lit: https://lit.dev/docs/
 * It display the year's monthes in a table accoring to the given parameters: year, locale, year-is-first.
 * 'Year' is a number, like 2024.
 * The 'locale' and the DateTime is based on the Luxon library, more info: https://moment.github.io/luxon/api-docs/index.html#luxon
 * The 'year-is-first' / 'yearIsFirst' parameter is drive if the format of the month calendar header is year-month vs month-year (2024 July vs July 2024).
 * If you don't give yearIsFirst parameter then the default value will be used, which is false.
 * 
 * @author gl0b3 (aka Károly Kótay-Szabó)
 */
@customElement("year-calendar")
export class YearCalendar extends LitElement {
  @property({ type: Number, attribute: 'year', reflect: true }) year: number;
  @property({ type: String, attribute: 'locale', reflect: true}) locale: string  = "en";
  @property({ type: Boolean, attribute: 'year-is-first', reflect: true}) yearIsFirst: boolean = false;
  @property({ type: Boolean, attribute: 'show-other-month-days', reflect: true}) showOtherMonthDays: boolean = false;
  @property({ type: String , attribute: 'weekday-type', reflect: true}) weekdayType: 'narrow'|'short'|'long' = 'short';

  @queryAll('month-calendar')
  _monthCalendars;

  /**
   * This runs first when we create the object.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Renders the template of the custom Lit component
   * @returns {TemplateResult} the template we want to display int he browser.
   */
  render(): TemplateResult {
    return html`
      <div class="year-calendar">
        <table cellspacing="0" cellpadding="0" class="year">
          <colgroup>
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="1"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="2"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="3"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="4"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
            </tr>
            <tr>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="5"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="6"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="7"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="8"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
            </tr>
            <tr>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="9"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="10"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="11"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
              <td align="center">
                <month-calendar
                  year=${this.year}
                  month="12"
                  ?year-is-first="${this.yearIsFirst}"
                  locale=${this.locale}
                  ?show-other-month-days=${this.showOtherMonthDays}
                  weekday-type=${this.weekdayType}
                ></month-calendar>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  public setYear(year: number) {
    this.year = year;
  }

  public setLocale(locale: string) {
    this.locale = locale;
  }

  public setYearIsFirst(yearIsFirst: boolean) {
    this.yearIsFirst = yearIsFirst;
  }

  public setShowOtherMonthDays(showOtherMonthDays: boolean) {
    this.showOtherMonthDays = showOtherMonthDays;
  }

  public setWeekdayType(weekdayType: "narrow" | "short" | "long") {
    this.weekdayType = weekdayType;
  }

  /**
   * Remove style class from a day cells by the given cellType.
   * @param cellType the day cell type: 'weekday' or 'weekend'
   * @param className the class to be removed, ie: 'weekend'
   */
  public removeClassFromCellByType(cellType: string, className: string) {
    const monthCalendars = this.shadowRoot?.querySelectorAll('month-calendar');
    monthCalendars?.forEach((monthCalendar) => {
      (monthCalendar as MonthCalendar).removeClassFromCellByType(cellType, className);
    });
  }

  /**
   * Add style class to all month day cells by the given dates.
   * @param dates the dates that determine which cells have to be modified
   * @param className the style class which have to be add to the cell
   */
  public addClassToCellByDates(dates: Date[], className: string) {
    const monthCalendars = this.shadowRoot?.querySelectorAll('month-calendar');
    monthCalendars?.forEach((monthCalendar) => {
      (monthCalendar as MonthCalendar).addClassToCellByDates(dates, className);
    });
  }

  // ShadowDOM root
  get root() {
    return this.shadowRoot;
  }

  /**
   * Adding static styles for the year-calendar component, which will be in the Shadow DOM.
   */
  static override get styles(): CSSResult[] {
    return [
      css`
        .year-calendar table.year td {
            vertical-align: top;
            text-align: center;
        }

        table {
          border-color: transparent;
          border-collapse: collapse;
        }

        .year-calendar table tbody tr td {
          padding-top: var(--year-month-gap-top, 0);
          padding-right: var(--year-month-gap-right, 20px);
          padding-bottom: var(--year-month-gap-bottom, 20px);
          padding-left: var(--year-month-gap-left, 0);
        }
      `,
    ];
  }

  // Invoked (each time) when this component is appended/attached to a document's DOM.
  connectedCallback() {
    super.connectedCallback();
  }

  // Invoked when this component is removed from the document's DOM
  disconnectedCallback() {
      super.disconnectedCallback();
  }

    /**
   * If one of the observed attributes changes, this function is calledthen this function will be called.
   * @param name - name of the attribute
   * @param oldval - the old value
   * @param newval - the new value
   */
  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    this.requestUpdate();
  }
}

// Declaring the year-calendar tag for global
declare global {
  interface HTMLElementTagNameMap {
    "year-calendar": YearCalendar;
  }
}
