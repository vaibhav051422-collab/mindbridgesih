import React, { useState, useEffect } from 'react';
import { FiHeart, FiMessageCircle, FiPlus, FiX } from 'react-icons/fi';
import { supabase } from '../supabaseClient'; 

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'success_story' });
  const [user, setUser] = useState(null);

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'success_story', label: 'Success Stories', color: 'bg-green-100 text-green-800' },
    { id: 'advice', label: 'Advice', color: 'bg-blue-100 text-blue-800' },
    { id: 'question', label: 'Questions', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'motivation', label: 'Motivation', color: 'bg-purple-100 text-purple-800' }
  ];

  // ✅ Get current session user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Anonymous'
        });
      }
    };
    fetchUser();
  }, []);


  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      setPosts(data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(p => p.category === filter));
    }
  }, [filter, posts]);

  // ✅ Handle new post creation and insert into Supabase
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first!");
      return;
    }

    const post = {
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      user_id: user.id,
      created_at: new Date().toISOString(),
      likes: 0,
      comments: 0
    };

    const { data, error } = await supabase
      .from('community_posts')
      .insert([post])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error.message);
    } else {
      setPosts([data, ...posts]);
      setNewPost({ title: '', content: '', category: 'success_story' });
      setShowCreatePost(false);
    }
  };


  const handleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const { data, error } = await supabase
      .from('community_posts')
      .update({ likes: post.likes + 1 })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error liking post:', error.message);
    } else {
      setPosts(posts.map(p => p.id === postId ? data : p));
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Community Wall</h1>
            <p className="text-gray-500 mt-1">Share experiences, get advice, and support each other.</p>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-transform hover:scale-105 shadow-md flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>Share Story</span>
          </button>
        </div>

        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Share Your Story</h3>
                  <button onClick={() => setShowCreatePost(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24}/></button>
                </div>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <input type="text" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Title of your post" required />
                  <select value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  <textarea value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none" placeholder="Share your experience..." required />
                  <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={() => setShowCreatePost(false)} className="px-5 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">Share</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                  filter === cat.id ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Posts Yet</h3>
              <p className="text-gray-500 mb-6">Be the first to share your story and inspire others!</p>
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-transform hover:scale-105 shadow-md inline-flex items-center space-x-2"
              >
                <FiPlus className="w-5 h-5" />
                <span>Share Your First Story</span>
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-md border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-bold text-gray-600">{post.author?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{post.author || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${categories.find(c => c.id === post.category)?.color || 'bg-gray-100 text-gray-800'}`}>
                  {categories.find(c => c.id === post.category)?.label || 'General'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{post.content}</p>

              <div className="flex items-center space-x-6 text-gray-500 pt-4 border-t">
                <button onClick={() => handleLike(post.id)} className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                  <FiHeart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                  <FiMessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
