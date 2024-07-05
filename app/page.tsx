import Posts from "./components/Posts"
import MyProfilePic from './components/MyProfilePic'

export const revalidate = 10 //ISR freq

export default function Home() {
  return (
    <div className="mx-auto">
      <MyProfilePic />
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and Welcome 👋&nbsp;
        <span className="whitespace-nowrap">
          I'm <span className="font-bold">Dave</span>.
        </span>
      </p>
      {/* @ts-expect-error Server Component */}
      <Posts />
    </div>
  )
}

//pulling MDX files in from a separate remote GitHub repository using the GitHub API and this really solves our biggest problem by using a GitHub repository for the MDX files we'll be able to update or create new content and push it to the remote repository without needing to redeploy our next JS site and then by utilizing JSX revalidation that ISR that we set up with revalidation settings we'll be able to see the new content

//We going to use the GitHub API to request these files because if we do it when we're unauthorized they actually rate limit you to 60 requests per hour