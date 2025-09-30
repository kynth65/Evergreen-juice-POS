import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2C10.8954 2 10 2.89543 10 4V5H8C6.89543 5 6 5.89543 6 7V20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20V7C18 5.89543 17.1046 5 16 5H14V4C14 2.89543 13.1046 2 12 2ZM12 4C12.5523 4 13 4.44772 13 5V6H11V5C11 4.44772 11.4477 4 12 4ZM8 7H16V20H8V7Z"
            />
            <circle cx="12" cy="11" r="1.5" />
            <circle cx="12" cy="15" r="1.5" />
            <path d="M9 10C9.55228 10 10 9.55228 10 9C10 8.44772 9.55228 8 9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10Z" />
            <path d="M15 10C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8C14.4477 8 14 8.44772 14 9C14 9.55228 14.4477 10 15 10Z" />
        </svg>
    );
}
