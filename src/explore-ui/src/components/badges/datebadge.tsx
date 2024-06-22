import { ExifDateTime } from "exiftool-vendored";
import moment from "moment";
import "./DateBadge.styles.scss";

export type DateBadgeProps = {
  val?: string | ExifDateTime;
  variant?: "short";
  plain?: boolean;
};

const DateBadge = (props: DateBadgeProps) => {
  const { val, variant, plain } = props;
  if (!val || typeof val === "string") return null;

  if (typeof val === "object") {
    const _date = moment(val.rawValue, "YYYY:MM:DD hh:mm:ss");

    const classes = [
      variant ? `DateBadge_${variant}` : "",
      plain ? `DateBadge_Plain` : "DateBadge",
    ];

    if (_date.isValid()) {
      if (plain) {
        return (
          <div className={classes.join(" ")}>
            {_date.format("MMM Do, YYYY")}
          </div>
        );
      }

      return (
        <div className={classes.join(" ")}>
          {variant === "short" ? (
            <span className="DateBadge__MonthDay">{_date.format("MMM")}</span>
          ) : (
            <span className="DateBadge__MonthDay">
              {_date.format("MMM Do")}
            </span>
          )}

          <span className="DateBadge__Year">{_date.format("YYYY")}</span>
        </div>
      );
    }
  }
  return null;
};

export default DateBadge;
