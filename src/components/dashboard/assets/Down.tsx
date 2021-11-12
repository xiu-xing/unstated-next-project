import * as React from "react";

function Svg(props: React.SVGProps<SVGSVGElement>, svgRef?: React.Ref<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" ref={svgRef} {...props}>
      <path
        d="M5.885 10.073l2.887-3.128m-2.887 3.128L3 6.945m2.885 3.128V2"
        stroke="#78DCD2"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(Svg);
export default ForwardRef;
