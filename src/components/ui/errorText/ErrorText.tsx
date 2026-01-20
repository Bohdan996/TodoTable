import './ErrorText.scss';

type ErrorTextProps = {
  text: string;
}

export default function ErrorText({
  text
}: ErrorTextProps) {
  return (
    <span className="ErrorText">
      {text}
    </span>
  )
}
