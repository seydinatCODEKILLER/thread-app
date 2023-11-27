import CommunityCard from "@/components/cards/CommunityCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page({searchParams}: {searchParams: {[key: string]: string | undefined }}) {

    const user = await currentUser();
    if(!user) return null;
    
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    //Fetch Community
    const result = await fetchCommunities({
        searchString: searchParams.q,
        pageNumber: searchParams?.page ? +searchParams.page : 1,
        pageSize: 25
    })

    return (
        <section>
            <h1 className="head-text mb-10">Communities</h1>

            {/* searchBar */}
            <div className="mt-5">
            <Searchbar routeType="communities"/>
            </div>
            
            <div className="mt-14 flex flex-col gap-9">
                {result?.communities.length === 0 ? (
                    <p className="no-result">No users</p>
                ): (
                    <>
                    {result?.communities.map((communitie) => (
                        <CommunityCard 
                        key={communitie.id}
                        id={communitie.id}
                        name={communitie.name}
                        username={communitie.username}
                        imgUrl={communitie.image}
                        bio={communitie.bio}
                        members={communitie.members}
                        />
                    ))}
                    </>
                )}
            </div>

            <Pagination 
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={result.isNext}
            path="communites"
            />

        </section>
    )
}

export default Page