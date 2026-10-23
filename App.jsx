import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";

function getCoins() {
  return fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd"

  ).then((res) => {
    if (!res.ok) {
      throw new Error("API error");
    }
    return res.json();
  });
}

function App() {
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["coins"],
    queryFn: getCoins,
    refetchInterval: 10000
  });

  const favoriteMutation = useMutation({
    mutationFn: (coin) => {
      return Promise.resolve(coin);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"]
      });

      alert("Favorite saved!");
    }
  });

  if (isPending) {
    return <h2>Loading prices...</h2>;
  }

  if (isError) {
    return <h2>Something went wrong!</h2>;
  }

  return (
    <div>
      <h1>Crypto Prices</h1>

      <h3>Bitcoin: ${data.bitcoin.usd}</h3>
      <button onClick={() => favoriteMutation.mutate("bitcoin")}>
        Add Bitcoin to Favorite
      </button>

      <h3>Ethereum: ${data.ethereum.usd}</h3>
      <button onClick={() => favoriteMutation.mutate("ethereum")}>
        Add Ethereum to Favorite
      </button>

      <h3>Dogecoin: ${data.dogecoin.usd}</h3>
      <button onClick={() => favoriteMutation.mutate("dogecoin")}>
        Add Dogecoin to Favorite
      </button>

      {favoriteMutation.isPending && <p>Saving favorite...</p>}
    </div>
  );
}
 export default App;


