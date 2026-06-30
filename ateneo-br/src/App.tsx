import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Shell } from '@/components/layout/Shell';
import Home from '@/pages/Home';
import Browse from '@/pages/Browse';
import BathroomDetail from '@/pages/BathroomDetail';
import SubmitBathroom from '@/pages/SubmitBathroom';
import BestForPeeing from '@/pages/BestForPeeing';
import BestForPooping from '@/pages/BestForPooping';
import BestForMakingOut from '@/pages/BestForMakingOut';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/bathrooms" component={Browse} />
        <Route path="/bathrooms/:id" component={BathroomDetail} />
        <Route path="/submit" component={SubmitBathroom} />
        <Route path="/best/peeing" component={BestForPeeing} />
        <Route path="/best/pooping" component={BestForPooping} />
        <Route path="/best/making-out" component={BestForMakingOut} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
