export const lesson1Example = `
# 問題のレベル
BASIC

# 問題の特徴
* 1つのメソッドや短いコードで完結する基本的な問題

# 例
  {
    content:
      "Reactを使って、クリックするたびに数字が1ずつ増えるボタンを作成してください。

初期の表示は「カウント: 0」と表示されていること。

ボタンを押すたびに数字が1ずつ増えて表示されること。",
    template:
      "import React from 'react';

function CounterButton() {
  // ここにコードを書いてください。
}

export default CounterButton;",
    title: "ボタンを押してカウントを増やそう",
    example: "",
    exampleAnswer: "import React, { useState } from 'react';

function CounterButton() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={increment}>クリックして増やす</button>
    </div>
  );
}

export default CounterButton;",
    tags: ["FUNCTION", "STATE", "HOOK"],
    level: "BASIC",
    inputCode: "",
    outputCode: "",
  }
`;

export const lesson2Example = `
# 問題のレベル
ADVANCED

# 問題の特徴
* 複数の概念を組み合わせた応用的な問題
* エラー処理やパフォーマンス最適化が必要な問題

# 例
  {
    content:
      "Reactを使って、APIからデータを取得して表示するTodoリストを作成してください。

以下の機能を実装してください：
1. APIからTodoデータを取得して表示する
2. ローディング中はスピナーを表示する
3. エラーが発生した場合はエラーメッセージを表示する
4. Todoの完了状態を切り替えられるようにする
5. useMemoを使って、完了したTodoと未完了のTodoの数を効率的に計算する

APIエンドポイント: 'https://jsonplaceholder.typicode.com/todos'",
    template:
      "import React from 'react';

function TodoList() {
  // ここにコードを書いてください。
}

export default TodoList;",
    title: "APIを使ったTodoリストの実装",
    example: "",
    exampleAnswer: "import React, { useState, useEffect, useMemo } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');

        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const data = await response.json();
        setTodos(data.slice(0, 10)); // 最初の10件だけ取得
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const todoStats = useMemo(() => {
    const completedCount = todos.filter(todo => todo.completed).length;
    return {
      completed: completedCount,
      incomplete: todos.length - completedCount
    };
  }, [todos]);

  if (loading) {
    return <div className="flex justify-center p-4"><div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">エラー: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Todoリスト</h1>
      <div className="mb-4">
        <p>完了: {todoStats.completed}</p>
        <p>未完了: {todoStats.incomplete}</p>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={\`p-2 border rounded \${todo.completed ? 'bg-green-100' : 'bg-white'}\`}
          >
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-5 w-5"
              />
              <span className={\`\${todo.completed ? 'line-through text-gray-500' : ''}\`}>
                {todo.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;",
    tags: ["API", "EFFECT", "ERROR_HANDLING", "USEMEMO", "DATA_FETCHING"],
    level: "ADVANCED",
    inputCode: "",
    outputCode: "",
  }
`;

export const lesson3Example = `
# 問題のレベル
REAL_WORLD

# 問題の特徴
* 実際の業務で必要とされる複雑な機能を実装する問題
* 複数のコンポーネント連携やカスタムフックの活用が必要
* フォーム検証やアクセシビリティ対応などの実践的な要素を含む

# 例
  {
    content:
      "オンラインショッピングアプリのショッピングカート機能を実装してください。以下の要件を満たす必要があります：

1. 商品リストからカートに商品を追加できる
2. カート内の商品数量を増減できる
3. カートから商品を削除できる
4. カート内の合計金額を表示する
5. カスタムフックを使ってカート状態を管理する
6. ローカルストレージを使ってカート情報を永続化する
7. レスポンシブデザインに対応させる
8. アクセシビリティに配慮する（キーボード操作、適切なaria属性など）

商品データは以下の形式で与えられます：
\`\`\`
[
  { id: 1, name: '高級腕時計', price: 25000, image: '/watch.jpg' },
  { id: 2, name: 'スマートフォン', price: 80000, image: '/smartphone.jpg' },
  { id: 3, name: 'ワイヤレスイヤホン', price: 15000, image: '/earphones.jpg' },
  { id: 4, name: 'ノートパソコン', price: 120000, image: '/laptop.jpg' }
]
\`\`\`",
    template:
      "// ShoppingCart.tsx
import React from 'react';
import { Product } from './types';

// 必要なコンポーネントやカスタムフックを作成してください
// useCart.ts などのカスタムフックも作成する必要があります

function ShoppingCart() {
  // ここにコードを書いてください
}

export default ShoppingCart;

// types.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}",
    title: "ショッピングカート機能の実装",
    example: "",
    exampleAnswer: "// useCart.ts
import { useState, useEffect } from 'react';
import { Product, CartItem } from './types';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ローカルストレージからカート情報を読み込む
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('カートの読み込みに失敗しました', e);
      }
    }
  }, []);

  // カート情報が変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 商品をカートに追加
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // 商品の数量を変更
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // 商品をカートから削除
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  // 合計金額を計算
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // カート内の商品数を計算
  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    itemCount
  };
}

// ProductList.tsx
import React from 'react';
import { Product } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <div
          key={product.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-square bg-gray-200 mb-3 rounded overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-bold text-lg mb-1">{product.name}</h3>
          <p className="text-gray-700 mb-3">¥{product.price.toLocaleString()}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
            aria-label={\`\${product.name}をカートに追加\`}
          >
            <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
            カートに追加
          </button>
        </div>
      ))}
    </div>
  );
}

// CartItem.tsx
import React from 'react';
import { CartItem as CartItemType } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center border-b py-4 last:border-b-0">
      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-gray-600">¥{item.price.toLocaleString()}</p>
      </div>

      <div className="flex items-center">
        <div className="flex items-center border rounded overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="数量を減らす"
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>

          <span className="px-3 py-1 text-center min-w-[40px]" aria-live="polite">
            {item.quantity}
          </span>

          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="数量を増やす"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="ml-3 text-red-500 hover:text-red-700 transition-colors"
          aria-label={\`\${item.name}をカートから削除\`}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

// ShoppingCart.tsx
import React from 'react';
import { useCart } from './useCart';
import { ProductList } from './ProductList';
import { CartItemComponent } from './CartItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

// 商品データ
const products = [
  { id: 1, name: '高級腕時計', price: 25000, image: '/watch.jpg' },
  { id: 2, name: 'スマートフォン', price: 80000, image: '/smartphone.jpg' },
  { id: 3, name: 'ワイヤレスイヤホン', price: 15000, image: '/earphones.jpg' },
  { id: 4, name: 'ノートパソコン', price: 120000, image: '/laptop.jpg' }
];

function ShoppingCart() {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    itemCount
  } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">オンラインショップ</h1>
          <div className="relative">
            <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">商品一覧</h2>
          <ProductList products={products} onAddToCart={addToCart} />
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">
            ショッピングカート
            {itemCount > 0 && <span className="ml-2 text-sm text-gray-500">({itemCount}点)</span>}
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">カートに商品がありません</p>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                {cartItems.map(item => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="font-bold">合計:</span>
                  <span className="text-xl font-bold">¥{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-right">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                  aria-label="レジに進む"
                >
                  レジに進む
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default ShoppingCart;

// types.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}",
    tags: ["CUSTOM_HOOK", "COMPONENT_COMPOSITION", "ACCESSIBILITY", "LOCALSTORAGE", "RESPONSIVE"],
    level: "REAL_WORLD",
    inputCode: "",
    outputCode: "",
  }
`;
