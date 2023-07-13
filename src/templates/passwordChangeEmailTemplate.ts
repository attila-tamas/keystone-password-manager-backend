import { expirationDateHandler } from "@util/dateHandler";

export default function PasswordChangeRequestEmailTemplate(
	token: string,
	tokenMaxAgeSeconds: number
) {
	const tokenExpirationDate = expirationDateHandler(tokenMaxAgeSeconds);
	return `
		<div style="width: 100%; background-color: #F8F9FC; display: flex; flex-direction: column; text-align: center;">
			<div style="max-width: 34.0625em; margin: 4% auto; padding: 2% 4%; padding-top: 0; background-color: #FFFFFF; border-radius: 0.5em; border: 0.0625em solid #EDEEF1;">

				<div style="width: fit-content; display: flex; align-items: center; gap: 0.5em; margin: 0 auto;">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clip-path="url(#clip0_379_328)">
						<path d="M2.01904 12.9461C2.93471 15.1767 3.64292 16.3928 5.18258 18.2485C7.33622 20.8442 11.9999 23.5509 11.9999 23.5509C11.9999 23.5509 16.8101 20.9336 18.8862 18.2485C18.8862 18.2485 16.8087 18.2554 15.4775 17.9951C14.1463 17.7348 12.0688 16.9154 12.0688 16.9154C12.0688 16.9154 9.94639 15.6836 8.96629 14.5023C8.26561 13.6578 7.94331 13.1044 7.5266 12.0892C6.89086 10.5405 6.83527 7.85852 6.83527 7.85852C6.83527 7.85852 5.303 9.08934 4.42716 9.98914C3.3884 11.0563 2.01904 12.9461 2.01904 12.9461Z" fill="#54B872"/>
						<path d="M18.8865 18.2484C20.3164 16.399 20.8159 15.1242 21.6644 12.946C23.0075 9.49777 23.5002 3.64958 23.5002 3.64958C23.5002 3.64958 20.121 1.68632 17.7502 0.963951C17.1307 0.77519 16.5827 0.615812 16.0631 0.484375C16.0631 0.484375 16.854 2.69581 17.096 4.1714C17.3295 5.59451 17.3026 7.85843 17.3026 7.85843C17.3026 7.85843 17.0784 10.5199 16.4671 12.0891C16.081 13.0804 15.8537 13.6606 15.2029 14.5022C14.2581 15.7242 12.0691 16.9153 12.0691 16.9153C12.0691 16.9153 14.1466 17.7347 15.4778 17.995C16.8089 18.2553 18.8865 18.2484 18.8865 18.2484Z" fill="#5AC97A"/>
						<path d="M6.25 0.964072C3.87924 1.68644 0.5 3.6497 0.5 3.6497C0.5 3.6497 0.62216 9.54305 2.0191 12.9461C2.0191 12.9461 3.38845 11.0563 4.42722 9.98916C5.30306 9.08937 6.83533 7.85855 6.83533 7.85855C6.83533 7.85855 8.37319 6.96509 9.4521 6.63634C10.4433 6.33433 11.0327 6.19761 12.0689 6.19761C13.105 6.19761 13.6944 6.33433 14.6856 6.63634C15.7645 6.96509 17.3024 7.85855 17.3024 7.85855C17.3024 7.85855 17.3293 5.59463 17.0958 4.17152C16.8538 2.69593 16.0629 0.484496 16.0629 0.484496C14.7558 0.153833 13.6292 0 12 0C9.72314 0 8.428 0.300436 6.25 0.964072Z" fill="#5AC97A"/>
						</g>
						<defs>
						<clipPath id="clip0_379_328">
						<rect width="24" height="24" fill="white" transform="translate(0.5)"/>
						</clipPath>
						</defs>
					</svg>

					<p style="font-size: 1.5em">
						<span style="color: #5AC97A;">key</span>stone
					</p>
				</div>


				<h1 style="padding: 0; margin: 0; font-size: 1.5em;">Password change request</h1>

				<p style="font-size: 1.125em">
					A request has been received to change the password for your account. Your one-time verification code is:
				</p>

				<p style="font-weight: bold; font-size: 1.75em;">${token}</p>

				<p style="font-size: 0.875em">This code will expire on ${tokenExpirationDate}</p>

				<p style="font-size: 0.875em">
					If you did not request this change or if you would no longer like to change your existing password, you can safely ignore this email.
				</p>
			</div>
		</div>
	`;
}
