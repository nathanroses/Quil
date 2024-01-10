import Dashboard from '@/components/Dashboard';
import { db } from '@/db';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser(); // Await the result of getUser

  // Check if user is null or doesn't have an id
  if (!user || !user.id) {
    redirect('/auth-callback?origin=dashboard');
    return; // Return early to prevent further execution
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id
    }
  });

  if(!dbUser) {
    redirect('/auth-callback?origin=dashboard');
    return; // Return early to prevent further execution
  }

  const subscriptionPlan = await getUserSubscriptionPlan();

  return <Dashboard subscriptionPlan={subscriptionPlan} />;
}

export default Page;
